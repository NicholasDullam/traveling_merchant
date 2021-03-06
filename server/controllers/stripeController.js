const stripe = require('stripe')(process.env.STRIPE_SECRET)
const User = require('../models/user')
const Order = require('../models/order')
const jwt = require('jsonwebtoken')

const createCustomer = (name, email) => {
    return stripe.customers.create({ name, email })
}

const createAccount = async (req, res) => {
    if (req.user.acct_id) return res.status(400).json({ error: 'Stripe account already created'})
    let account = await stripe.accounts.create({
        type: 'express',
        metadata: { user_id: req.user.id }
    })

    User.findOneAndUpdate({ _id: req.user.id }, { acct_id: account.id }, { new: true }).then((response) => {
        const token = jwt.sign({ id: response._id, cust_id: response.cust_id, acct_id: response.acct_id, admin: response.admin, banned: response.banned }, process.env.TOKEN_SECRET)
        return res.cookie('access_token', token, { httpOnly: true, secure:process.env.NODE_ENV === 'production' }).status(200).json(response)
    }).catch((error) => {
        console.log(error)
        return res.status(400).json({ error: error.message })
    })
}

const getAccountOnboarding = (req, res) => {
    let { acct_id } = req.params
    if (!req.user.admin && req.user.acct_id !== acct_id) return res.status(402).json({ message: 'Invalid Permissions' })
    stripe.accountLinks.create({
        account: acct_id,
        refresh_url: 'http://localhost:3000/profile/info',
        return_url: 'http://localhost:3000/profile/info',
        type: 'account_onboarding'
    }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getClientSecret = async (req, res) => {
    let { pi_id } = req.params
    if (!pi_id) return res.status(400).json({ error: 'Missing payment request id'})
    stripe.paymentIntents.retrieve(pi_id).then((response) => {
        return res.status(200).json({ client_secret: response.client_secret })
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const verifyPaymentIntent = async (pi_id) => {
    return stripe.paymentIntents.retrieve(pi_id).then((response) => {
        return response.status === 'succeeded'
    }).catch((error) => {
        return false
    })
}

const createPaymentIntentFromOrder = async (order_id, customer_id) => {
    const order = await Order.findById(order_id)
    const amount = order.quantity * order.unit_price

    let payment_intent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        transfer_group: order_id,
        customer: customer_id,
        metadata: { order_id }
    })
    
    return Order.findOneAndUpdate({ _id: order_id }, { pi_id: payment_intent.id }, { new: true })
}

const transferToSellerFromOrder = async (order) => {
    const amount = order.quantity * order.unit_price 
    const commission = amount * .1

    let paymentIntent = await stripe.paymentIntents.retrieve(order.pi_id)

    let transfer = await stripe.transfers.create({
        amount: amount - commission,
        currency: 'usd',
        destination: order.seller.acct_id,
        source_transaction: paymentIntent.charges.data[0].id,
        transfer_group: order._id,
        metadata: { order_id: order._id }
    })

    return Order.findByIdAndUpdate(order._id, { status: 'confirmed', confirmed_at: Date.now(), auto_confirm_at: null, tr_id: transfer.id }, { new: true })
}

const getPaymentMethods = async (req, res) => {
    let { customer_id } = req.params
    stripe.paymentMethods.list({
        customer: customer_id,
        type: 'card'
    }).then((response) => {
        return res.status(200).json(response.data)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deletePaymentMethod = async (req, res) => {
    let { pm_id } = req.params
    let paymentMethod = await stripe.paymentMethods.retrieve(pm_id)
    if (paymentMethod.customer !== req.user.cust_id) return res.status(402).json({ error: 'Invalid permissions' })
    stripe.paymentMethods.detach(pm_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const webHooks = async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_ENDPOINT);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'account.updated' : {
            await User.findOneAndUpdate({ 'acct_id' : event.data.object.account.id }, { acct_details_submitted: event.data.object.account.details_submitted }) 
            break 
        }

        default: {
            return res.status(400).end();
        }
    }

    res.json({ received: true });
}


module.exports = {
    createAccount,
    createCustomer,
    getAccountOnboarding,
    getClientSecret,
    createPaymentIntentFromOrder,
    transferToSellerFromOrder,
    getPaymentMethods,
    verifyPaymentIntent,
    deletePaymentMethod,
    webHooks
}
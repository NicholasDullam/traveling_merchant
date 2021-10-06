const stripe = require('stripe')(process.env.STRIPE_SECRET)
const User = require('../models/user')
const Order = require('../models/order')

const createAccount = async (req, res) => {
    let account = await stripe.accounts.create({
        type: 'express',
        metadata: { user_id: req.user.id }
    })

    User.updateOne(req.user.id, { acct_id: account.id }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getAccountOnboarding = (req, res) => {
    stripe.accountLinks.create({
        account: req.user.acct_id,
        refresh_url: '',
        return_url: '',
        type: 'account_onboarding'
    }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const createPaymentIntentFromOrder = async (req, res) => {
    const order = await Order.findById(req.body.order_id).populate('seller')
    const amount = order.products.reduce((a, b) => a + (b.unit_price * b.quantity), 0)
    const application_fee_amount = amount * .1

    stripe.paymentIntents.create({
        payment_method_types: ['card'],
        amount,
        application_fee_amount,
        transfer_data: { destination: order.seller.acct_id },
        metadata: { order_id: req.body.order_id }
    }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createAccount,
    getAccountOnboarding,
    createPaymentIntentFromOrder,
}
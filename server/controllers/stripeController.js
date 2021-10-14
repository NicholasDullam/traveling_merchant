const stripe = require('stripe')(process.env.STRIPE_SECRET)
const User = require('../models/user')
const Order = require('../models/order')

// route controllers

const createAccount = async (req, res) => {
    if (req.user.acct_id) return res.status(400).json({ error: 'Stripe account already created'})
    let account = await stripe.accounts.create({
        type: 'express',
        metadata: { user_id: req.user.id }
    })

    User.findOneAndUpdate({ _id: req.user.id }, { acct_id: account.id }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getAccountOnboarding = (req, res) => {
    let { acct_id } = req.params
    if (!req.user.admin && req.user.acct_id !== acct_id) return res.status(402).json({ message: 'Invalid Permissions' })
    stripe.accountLinks.create({
        account: acct_id,
        refresh_url: 'http://localhost:8000/api/game',
        return_url: 'http://localhost:8000/api/game',
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

// helper functions

const createPaymentIntentFromOrder = async (order_id) => {
    const order = await Order.findById(order_id)
    const amount = order.quantity * order.unit_price

    let payment_intent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        transfer_group: order_id,
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

module.exports = {
    createAccount,
    getAccountOnboarding,
    getClientSecret,
    createPaymentIntentFromOrder,
    transferToSellerFromOrder
}
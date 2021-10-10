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
    if (!req.user.acct_id) return res.status(400).json({ error: `No stripe account registered for user ${req.user.id}` })
    stripe.accountLinks.create({
        account: req.user.acct_id,
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
    let { pr_id } = req.query
    if (!pr_id) return res.status(400).json({ error: 'Missing payment request id'})
    stripe.paymentIntents.retrieve(pr_id).then((response) => {
        return res.status(200).json({ client_secret: response.client_secret })
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

// helper functions

const createPaymentIntentFromOrder = async (order_id) => {
    const order = await Order.findById(order_id)
    if (!order) return res.status(400).json({ error: 'Order not found' })
    const amount = order.quantity * order.unit_price

    let payment_intent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        transfer_group: `{${order_id}}`,
        metadata: { order_id }
    })
    
    return Order.findOneAndUpdate({ _id: order_id }, { pr_id: payment_intent.id }, { new: true })
}

const transferToSellerFromOrder = async (order_id) => {
    const order = await Order.findById(order_id).populate('seller')
    if (!order) return res.status(400).json({ error: 'Order not found' })
    const amount = order.quantity * order.unit_price 
    const commission = amount * .1

    stripe.transfers.create({
        amount: amount - commission,
        currency: 'usd',
        destination: order.seller.acct_id,
        transfer_group: `{${order_id}}`,
        metadata: { order_id }
    }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}



module.exports = {
    createAccount,
    getAccountOnboarding,
    getClientSecret,
    createPaymentIntentFromOrder,
    transferToSellerFromOrder
}
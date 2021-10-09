const stripe = require('stripe')(process.env.STRIPE_SECRET)
const User = require('../models/user')
const Order = require('../models/order')

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

const createPaymentIntentFromOrder = async (req, res) => {
    let { order_id } = req.body
    const order = await Order.findById(order_id)
    if (!order) return res.status(400).json({ error: 'Order not found' })
    const amount = order.products.reduce((a, b) => a + (b.unit_price * b.quantity), 0)

    let payment_intent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        transfer_group: `{${order_id}}`,
        metadata: { order_id }
    })
    
    Order.findOneAndUpdate({ _id: order_id }, { pi_id: payment_intent.id }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const transferToSellerFromOrder = async (req, res) => {
    let { order_id } = req.body
    const order = await Order.findById(order_id).populate('seller')
    if (!order) return res.status(400).json({ error: 'Order not found' })
    const amount = order.products.reduce((a, b) => a + (b.unit_price * b.quantity), 0)
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
    createPaymentIntentFromOrder,
    transferToSellerFromOrder
}
const Order = require('../models/order')
const Product = require('../models/product')

const { transferToSellerFromOrder, createPaymentIntentFromOrder, verifyPaymentIntent } = require('./stripeController')
const { addJob, removeJob } = require('../cron')

const createOrder = async (req, res) => {
    let { product_id, quantity, requirements } = req.body
    
    if (!product_id) return res.status(400).json({ error: 'No products in order'})
    let product = await Product.findById(product_id)
    if (!product) return res.status(400).json({ error: 'Product not found'})
    if (quantity < product.min_quantity) return res.status(400).json({ error: 'Quantity less than minimum'})

    
    let order = new Order({
        buyer: req.user.id,
        seller: product.user_id,
        status: 'payment_pending',
        product_id,
        requirements,
        quantity,
        unit_price: product.unit_price,
    })

    order = await order.save()

    createPaymentIntentFromOrder(order._id, req.user.cust_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deliverOrder = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id)
    if (req.user.id !== order.seller.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    Order.findOneAndUpdate({ _id }, { status: 'confirmation_pending', delivered_at: Date.now(), auto_confirm_at: Date.now() + 259200 }, { new: true }).then((response) => {
        // initialize cronjob to handle auto-confirmations
        addJob(response._id, response.auto_confirm_at, () => {
            let order = Order.findById(response._id)
            if (order.status !== 'confirmation_pending') return
            transferToSellerFromOrder(order)
        })
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const confirmDelivery = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id).populate('seller')
    if (req.user.id !== order.buyer.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    removeJob(order._id) // remove cronjob given confirmation
    transferToSellerFromOrder(order).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const denyDelivery = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' }) 
    let order = await Order.findById(_id)
    if (req.user.id !== order.buyer.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    removeJob(order._id) // remove cronjob given cancellation
    Order.findOneAndUpdate({ _id }, { status: 'delivery_pending', auto_confirm_at: null }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const cancelOrder = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id)
    if (req.user.id !== order.seller.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    if (order.status === 'transfer_completed') return res.status(400).json({ error: 'Order already completed' })
    Order.findByIdAndUpdate(_id, { status: 'canceled', refunded: true }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const verifyPurchase = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id)
    if (order.status !== 'payment_pending') return res.status(400).json({ error: 'Payment already verified' })
    let verified = await verifyPaymentIntent(order.pi_id)
    if (!verified) return res.status(400).json({ error: 'Payment not verified' })
    Order.findByIdAndUpdate(_id, { status: 'delivery_pending' }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getOrderById = async (req, res) => {
    let { _id } = req.params
    Order.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getOrders = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Order.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = { 
    createOrder,
    deliverOrder,
    confirmDelivery,
    denyDelivery,
    cancelOrder,
    verifyPurchase,
    getOrderById,
    getOrders,
}
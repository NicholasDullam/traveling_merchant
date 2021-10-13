const order = require('../models/order')
const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')
const { transferToSellerFromOrder, createPaymentIntentFromOrder } = require('./stripeController')

const createOrder = async (req, res) => {
    let { product_id, quantity, requirements } = req.body
    
    if (!product_id) return res.status(400).json({ error: 'No products in order'})
    let product = await Product.findById(product_id)
    if (!product) return res.status(400).json({ error: 'Product not found'})
    if (quantity < product.min_quantity) return res.status(400).json({ error: 'Quantity less than minimum'})

    const user = await User.findById(req.user.id)
    let order = new Order({
        buyer: user,
        seller: product.user_id,
        status: 'payment_pending',
        product_id,
        requirements,
        quantity,
        unit_price: product.unit_price,
    })

    order = await order.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })

    /*createPaymentIntentFromOrder(order._id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })*/
}

const deliverOrder = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id)
    if (req.user.id !== order.seller.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    Order.findOneAndUpdate({ _id }, { status: 'confirmation_pending', delivered_at: Date.now(), auto_confirm_at: Date.now() + 259200 }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const confirmDelivery = async (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(_id)
    if (req.user.id !== order.buyer.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    let updatedOrder = await Order.findOneAndUpdate({ _id }, { status: 'confirmed', confirmed_at: Date.now(), auto_confirm_at: null }, { new: true })
    transferToSellerFromOrder(updatedOrder.order_id).then((response) => {
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
    if (req.user.id !== order.seller) return res.status(402).json({ error: 'Invalid permissions' })
    if (order.status === 'transfer_completed') return res.status(400).json({ error: 'Order already completed' })
    Order.findByIdAndUpdate(_id, { status: 'canceled', refunded: true }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getOrderById = async (req, res) => {
    let { _id } = req.body
    Order.find({buyer:_id}).then((response) => {
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
    getOrderById,
    getOrders
}
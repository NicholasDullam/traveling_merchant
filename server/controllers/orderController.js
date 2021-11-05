const Order = require('../models/order')
const Product = require('../models/product')

const { transferToSellerFromOrder, createPaymentIntentFromOrder, verifyPaymentIntent } = require('./stripeController')
const { addJob, removeJob } = require('../cron')

const handlePastDueConfirmations = () => {
    // Orders requiring immediate transfer
    Order.find({ auto_confirm_at: { $lte: Date.now() }}).populate('seller').then((response) => {
        response.forEach( async (order) => {
            if (!order.pi_id) return
            await transferToSellerFromOrder(order)
        })
    }).catch((error) => {
        console.log(error)
    })

    // Order requiring auto_confirm cron
    Order.find({ auto_confirm_at: { $gt: Date.now() }}).populate('seller').then((response) => {
        response.forEach((order) => {
            if (!order.pi_id) return
            addJob(order._id, order.auto_confirm_at, () => {
                if (order.status !== 'confirmation_pending') return
                transferToSellerFromOrder(order)
            })
        })
    })
}

const createOrder = async (req, res) => {
    let { product_id, quantity, requirements } = req.body
    
    if (!product_id) return res.status(400).json({ error: 'No products in order'})
    let product = await Product.findById(product_id)
    if (!product) return res.status(400).json({ error: 'Product not found'})
    //if (quantity > product.stock) return res.status({ error: 'Quantity exceeds stock'})
    if (quantity < product.min_quantity) return res.status(400).json({ error: 'Quantity less than minimum'})
    let total_cost = product.unit_price * quantity, commission_fees = total_cost * .15

    let order = new Order({
        buyer: req.user.id,
        seller: product.user_id,
        status: 'payment_pending',
        product_id,
        requirements,
        quantity,
        unit_price: product.unit_price,
        total_cost,
        commission_fees
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
    let date = new Date()
    date.setDate(date.getDate() + 3)
    Order.findOneAndUpdate({ _id }, { status: 'confirmation_pending', last_delivered_at: Date.now(), auto_confirm_at: date.getTime() }, { new: true }).then((response) => {
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
    if (req.user.id !== order.seller.toString() && !req.user.admin) return res.status(402).json({ error: 'Invalid permissions' })
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
    await Product.findByIdAndUpdate(order.product_id, { $inc: { stock: `-${order.quantity}`}})
    Order.findByIdAndUpdate(_id, { status: 'delivery_pending' }, { new: true }).then((response) => {
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
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Order.find({ ...query, status: { $ne: 'payment_pending' }})

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit) + 1)

    queryPromise.then((response) => {
        let results = { has_more: false, data: response }
        if (req.query.limit && response.length > Number(req.query.limit)) results = { has_more: true, data: response.slice(0, response.length - 1) }
        return res.status(200).json(results)
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
    handlePastDueConfirmations
}
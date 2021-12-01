const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose')

const { transferToSellerFromOrder, createPaymentIntentFromOrder, verifyPaymentIntent } = require('./stripeController')
const { addJob, removeJob } = require('../cron')

const handlePastDueConfirmations = () => {
    // Orders requiring immediate transfer
    Order.find({ auto_confirm_at: { $lte: Date.now() }}).populate('seller').then((response) => {
        response.forEach(async (order) => {
            await transferToSellerFromOrder(order)
        })
    }).catch((error) => {
        console.log(error)
    })

    // Order requiring auto_confirm cron
    Order.find({ auto_confirm_at: { $gt: Date.now() }}).populate('seller').then((response) => {
        response.forEach((order) => {
            addJob(order._id, order.auto_confirm_at, async function(response) {
                if (response.status !== 'confirmation_pending') return
                transferToSellerFromOrder(response)
            }.bind(null, order))
        })
    })
}

const createOrder = async (req, res) => {
    let { product, quantity, requirements, delivery_type } = req.body
    
    if (!product) return res.status(400).json({ error: 'No products in order'})
    product = await Product.findById(product)
    if (!product) return res.status(400).json({ error: 'Product not found'})
    if (quantity > product.stock) return res.status({ error: 'Quantity exceeds stock'})
    if (quantity < product.min_quantity) return res.status(400).json({ error: 'Quantity less than minimum'})
    let total_cost = product.unit_price * quantity, commission_fees = total_cost * .15

    let order = new Order({
        buyer: req.user.id,
        seller: product.user,
        status: 'payment_pending',
        product: product._id,
        delivery_type,
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
        console.log(error)
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
        addJob(response._id, response.auto_confirm_at, async function(response) {
            let order = await Order.findById(response._id).populate('seller')
            if (order.status !== 'confirmation_pending') return
            transferToSellerFromOrder(order)
        }.bind(null, response))
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
    let queryPromise = Order.findById(_id)

    if (req.query.expand) req.query.expand.forEach((instance) => {
        instance = instance.split('.')
        if (instance.length > 1) return queryPromise.populate({ path: instance[0], populate: { path: instance[1] }})
        return queryPromise.populate(instance)
    })
    
    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getSort = (sortString) => {
    let direction = 1
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
}

const getOrders = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit'], indices=['buyer', 'seller'], pipeline = []
    indices.forEach((el) => {
        if (query[el]) query[el] = mongoose.Types.ObjectId(query[el])
    })
    reserved.forEach((el) => delete query[el])

    pipeline.push({ $match: query })
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    
    // paginate pipeline facet
    pipeline.push({
        $facet: {
            data: function paginate () {
                let data = []
                if (req.query.skip) data.push({ $skip: Number(req.query.skip) })
                if (req.query.limit) data.push({ $limit: Number(req.query.limit) })
                return data
            } (),
            results: [{ $count: 'count' }]
        }
    })

    //paginate pipeline count removal
    pipeline.push({
        $project: {
            data: '$data',
            results: { $arrayElemAt: [ "$results", 0 ]}
        }
    })

    Order.aggregate(pipeline).then((response) => {
        return res.status(200).json({ ...response[0], results: { count: response[0].results ? response[0].results.count : 0, has_more: (Number(req.query.skip) || 0) + (Number(req.query.limit) || 0) < (response[0].results ? response[0].results.count : 0) }})    
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getPricing = async (req, res) => {
    let { _id } = req.params;
    if (!_id) return res.status(400).json({error:"No product"})
    var current_price;
    var last_updated;
    var returnJSON = { "points": []};
    Product.findById(_id).then((doc) => {
        if (!doc) return res.status(400).json({error:"No product found"})
        current_price = doc.unit_price;
        last_updated = doc.updated_at;
        let queryPromise = Order.find({product:_id});
    
        queryPromise = queryPromise.sort('-created_at');
        queryPromise = queryPromise.select('unit_price created_at');
    
        queryPromise.then((response) => {
            if (response[0].created_at < last_updated) {
                returnJSON.points.push({"price":current_price,"time":last_updated});
            }
            response.forEach((el) => {
                returnJSON.points.push({"price":el.unit_price,"time":el.created_at});
            })
            res.status(200).json(returnJSON)
        })
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
    handlePastDueConfirmations,
    getPricing
}
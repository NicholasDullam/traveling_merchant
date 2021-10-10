const order = require('../models/order')
const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')

const createOrder = async (req, res) => {
    let { product_id, quantity, requirements } = req.body
    
    if (!product_id) return res.status(400).json({ error: 'No products in order'})
    let product = await Product.findById(product_id)
    if (!product) return res.status(400).json({ error: 'Product not found'})
    if (quantity < product.min_quantity) return res.status(400).json({ error: 'Quantity less than minimum'})

    const order = new Order({
        buyer: req.user.id,
        seller: product.user_id,
        status: 'delivery_pending',
        product_id,
        requirements,
        quantity,
        unit_price: product.unit_price,
    })

    order.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deliverOrder = async (req, res) => {
    let { order_id } = req.body
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(order_id)
    if (req.user.id !== order.seller.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    Order.findOneAndUpdate({ _id: order_id }, { status: 'confirmation_pending', delivered_at: Date.now() }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const confirmDelivery = async (req, res) => {
    let { order_id } = req.body
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(order_id)
    if (req.user.id !== order.buyer.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    Order.findOneAndUpdate({ _id: order_id }, { status: 'confirmed', confirmed_at: Date.now(), auto_confirm_at: Date.now() + 259200 }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const denyDelivery = async (req, res) => {
    let { order_id } = req.body
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' }) 
    let order = await Order.findById(order_id)
    if (req.user.id !== order.buyer.toString()) return res.status(402).json({ error: 'Invalid permissions' })
    Order.findOneAndUpdate({ _id: order_id }, { status: 'delivery_pending', auto_confirm_at: null }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const cancelOrder = async (req, res) => {
    let { order_id } = req.body
    if (!order_id) return res.status(400).json({ error: 'Missing order_id' })
    let order = await Order.findById(order_id)
    if (req.user.id !== order.seller) return res.status(402).json({ error: 'Invalid permissions' })
    if (order.status === 'transfer_completed') return res.status(400).json({ error: 'Order already completed' })
    Order.findOneAndUpdate({ _id: order_id }, { status: 'canceled', refunded: true }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getOrders = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = order.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getUserOrders = (req, res) => {
    const user = User.findById(req.user.id).exec();
    if (!user) return res.status(400).json({ error: 'Account not found'});

    const orders = Order.find({buyer:user}).exec();
    if (!orders) return res.status(400).json({ error: 'Orders not found'});
    var retJson = "{\"products\" : [";
    // {"products": [{}, {},]}
    var i;
    for (i = 0; i < orders.length; i++) {
        retJson += "{ \"name\" : \"" + orders[i].product_id.name + "\", \"quantity\" : " + orders[i].quantity + ", \"status\" : \"" + orders[i].status + "\"}";
        if (i < orders.length - 1) {
            retJson += ","
        }
    }
    retJson += "]}"
    res.json(retJson).status(200);
    
}

module.exports = { 
    createOrder,
    deliverOrder,
    confirmDelivery,
    denyDelivery,
    cancelOrder,
    getOrders,
    getUserOrders
}
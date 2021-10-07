const Order = require('../models/order')
const Product = require('../models/product')

const createOrder = async (req, res) => {
    let { product_id, quantity, requirements } = req.body
    
    if (!product_id) return res.status(400).json({ error: 'No products in order'})
    let product = await Product.findById(product_id)
    if (!product) return res.status(400).json({ error: 'Product not found'})

    const order = new Order({
        buyer: req.user.id,
        seller: product.user_id,
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

module.exports = { 
    createOrder
}
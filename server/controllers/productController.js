const Product = require('../models/product')

const createProduct = (req, res) => {
    let { name, type, delivery_type, description, unit_price, min_quantity, stock } = req.body
    let product = new Product({
        user_id: req.user.id,
        name,
        type,
        delivery_type,
        description,
        unit_price,
        min_quantity,
        stock
    })

    product.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getProducts = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Product.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createProduct,
    getProducts
}
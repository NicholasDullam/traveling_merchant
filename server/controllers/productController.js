const Product = require('../models/product')
const User = require('../models/user')

const createProduct = async (req, res) => {
    let { name, type, delivery_type, delivery_speed, description, unit_price, min_quantity, stock, game_id } = req.body
    let product = new Product({
        user_id: req.user.id,
        game_id,
        name,
        type,
        delivery_type,
        delivery_speed,
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

const getProductById = (req, res) => {
    let { _id } = req.params
    Product.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(200).json({ error: error.message })
    })
}
  
const updateProductById = (req, res) => {
    let { _id } = req.params
    Product.findByIdAndUpdate(_id, req.body, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deleteProductById = (req, res) => {
    let { _id } = req.params
    Product.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById
}
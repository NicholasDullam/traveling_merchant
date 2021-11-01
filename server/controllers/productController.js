const Product = require('../models/product')
const mongoose = require('mongoose')

const createProduct = async (req, res) => {
    let { name, type, delivery_type, delivery_speed, description, unit_price, min_quantity, stock, game_id } = req.body
    if (!name || !type || !delivery_type || !delivery_speed || !description || !unit_price || !min_quantity || !stock || !game_id) return res.status(400).json({ error: "Invalid input"})
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
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit', 'q'], indices = ['game_id', 'user_id'], pipeline = []
    indices.forEach((el) => {
        if (query[el]) query[el] = mongoose.Types.ObjectId(query[el])
    })
    reserved.forEach((el) => delete query[el])

    if (req.query.q) pipeline.push({ $search: { index: 'productSearch', text: { query: req.query.q, path: { wildcard: '*' }}}})
    pipeline.push({ $match: query })
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    if (req.query.skip) pipeline.push({ $skip: Number(req.query.skip) })
    if (req.query.limit) pipeline.push({ $limit: Number(req.query.limit) + 1 })

    console.log(pipeline)

    Product.aggregate(pipeline).then((response) => {
        let results = { has_more: false, data: response }
        if (req.query.limit && response.length > Number(req.query.limit)) results = { has_more: true, data: response.slice(0, response.length - 1) }
        return res.status(200).json(results)    
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
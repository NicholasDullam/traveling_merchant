const Product = require('../models/product')
const View = require('../models/view')
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
const getSort = (sortString) => {
    let direction = 1
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
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

const getViewModes = async (user_id) => {
    const filter = { user_id: mongoose.Types.ObjectId(user_id) };
    
    let type = await View.aggregate([
        { $match: filter },
        { 
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $project: {
                product: { $arrayElemAt: [ "$product", 0 ]}
            }
        },
        {
            $group: {
                _id: '$product.type',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "count": -1
            }
        },
        {
            $limit: 1
        }
    ]);

    let platform = await View.aggregate([
        { $match: filter },
        { 
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $project: {
                product: { $arrayElemAt: [ "$product", 0 ]}
            }
        },
        {
            $group: {
                _id: '$product.platform',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "count": -1
            }
        }
    ]);

    let server = await View.aggregate([
        { $match: filter },
        { 
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $project: {
                product: { $arrayElemAt: [ "$product", 0 ]}
            }
        },
        {
            $group: {
                _id: '$product.server',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "count": -1
            }
        }
    ])

    return { type: type[0]._id, platform: platform[0]._id, server: server[0]._id }
}

const getRecommended = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit', 'q'], pipeline = []
    reserved.forEach((el) => delete query[el])
    let { platform, server, type } = await getViewModes(req.user.id)

    pipeline.push({ $search: { index: `productSearch`, text: { query: `${platform || ''} ${server || ''} ${type || ''}`.trim(), path: { wildcard: `*` }}}})
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    if (req.query.skip) pipeline.push({ $skip: Number(req.query.skip) })
    if (req.query.limit) pipeline.push({ $limit: Number(req.query.limit) })

    Product.aggregate(pipeline).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getSimilar = async (req, res) => {
    let { _id } = req.params
    let product = await Product.findById(_id), pipeline = []
    if (!product) return res.status(400).json({ error:'No product found' })
    let { platform, server, type } = product

    pipeline.push({ $search: { index: `productSearch`, text: { query: `${platform || ''} ${server || ''} ${type || ''}`.trim(), path: { wildcard: `*` }}}})
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    if (req.query.skip) pipeline.push({ $skip: Number(req.query.skip) })
    if (req.query.limit) pipeline.push({ $limit: Number(req.query.limit) })

    Product.aggregate(pipeline).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createProduct,
    getSimilar,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getRecommended
}
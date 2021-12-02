const Product = require('../models/product')
const View = require('../models/view')
const mongoose = require('mongoose')
const Order = require('../models/order')

const createProduct = async (req, res) => {
    let { name, type, delivery_types, description, unit_price, min_quantity, stock, game } = req.body
    if (!name || !type || !delivery_types || !description || !unit_price || !min_quantity || !stock || !game) return res.status(400).json({ error: "Invalid input"})
    let product = new Product({
        user: req.user.id,
        game,
        name,
        type,
        delivery_types,
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
    if (!sortString) return {}
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
}

const getProducts = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit', 'q', 'online', 'expand'], indices = ['game', 'user'], pipeline = []
    indices.forEach((el) => {
        if (query[el]) query[el] = mongoose.Types.ObjectId(query[el])
    })
    reserved.forEach((el) => delete query[el])

    if (req.query.q) pipeline.push({ $search: { index: 'productSearch', text: { query: req.query.q, path: { wildcard: '*' }}}})
    
    pipeline.push({ $match: query })

    if (req.query.expand) req.query.expand.forEach((instance) => {
        instance = instance.split('.')
        pipeline.push(
            { 
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            }
        )

        pipeline.push(
            {
                $unwind: "$user"
            }
        )
    })    

    pipeline.push({ $sort: { ...getSort(req.query.sort), "user.lvl": -1 } })
    
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

    Product.aggregate(pipeline).then((response) => {
        return res.status(200).json({ ...response[0], results: { count: response[0].results ? response[0].results.count : 0, has_more: (Number(req.query.skip) || 0) + (Number(req.query.limit) || 0) < (response[0].results ? response[0].results.count : 0) }})    
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getProductById = (req, res) => {
    let { _id } = req.params
    let queryPromise = Product.findById(_id)


    if (req.query.expand) req.query.expand.forEach((instance) => {
        instance = instance.split('.')
        if (instance.length > 1) return queryPromise.populate({ path: instance[0], populate: { path: instance[1] }})
        return queryPromise.populate(instance)
    })

    queryPromise.then((response) => {
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
    const filter = { user: mongoose.Types.ObjectId(user_id) };
    
    let type = await View.aggregate([
        { $match: filter },
        { 
            $lookup: {
                from: "products",
                localField: "product",
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
                localField: "product",
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
                localField: "product",
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
    if (!product) return res.status(400).json({ error: 'No product found' })
    let { platform, server, type } = product

    pipeline.push({ $search: { index: `productSearch`, text: { query: `${platform || ''} ${server || ''} ${type || ''}`.trim(), path: { wildcard: `*` }}}})
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    if (req.query.skip) pipeline.push({ $skip: Number(req.query.skip) })
    if (req.query.limit) pipeline.push({ $limit: Number(req.query.limit) })

    Product.aggregate(pipeline).then((response) => {
        for (var i = 0; i < response.length; i++) {
            if (response[i]._id == _id) {
                response.splice(i, 1);
                i--;
            }
        }
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getOthersPurchase = async (req, res) => {
    let { _id } = req.params

    let buyers = await Order.aggregate([
        { 
            $match: {
                product: mongoose.Types.ObjectId(_id) 
            } 
        },
        {
            $group: {
                _id: '$buyer'
            }
        }
    ])

    if (!buyers.length) return res.status(400).json({ error: 'No other buyers found' });

    let products = await Order.aggregate([
        {
            $match: {
                'buyer': { 
                    $in: buyers.map((buyer) => buyer._id)
                }
            }
        },
        {
            $group: {
                _id: '$product'
            }
        },
        { 
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $limit: 5
        }
    ]);

    products = products.map((product) => product.product[0])
    return res.status(200).json(products)
}

module.exports = {
    createProduct,
    getSimilar,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getRecommended,
    getOthersPurchase
}
const Filter = require('../models/filter')

const createFilter = async (req, res) => {
    let { word } = req.body;
    const filter = new Filter({ word })
    filter.save().then((response) => {
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

const getFilters = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit'], pipeline = []
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

    Filter.aggregate(pipeline).then((response) => {
        return res.status(200).json({ ...response[0], results: { ...response[0].results, has_more: (Number(req.query.skip) || 0) + (Number(req.query.limit) || 0) < response[0].results.count }})    
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deleteFilterById = (req, res) => {
    let { _id } = req.params
    Filter.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createFilter,
    getFilters,
    deleteFilterById
}
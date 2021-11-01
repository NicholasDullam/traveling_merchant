const View = require("../models/view")
const jwt = require('jsonwebtoken');

// assume request has product
const createView = async (req, res) => {
    let { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: "Invalid input"})
    token = req.cookies.view_history
    let view = new View({ product_id:product_id })
    if (req.user.id) view.user_id = req.user.id
    if (token) view.token = token
    else {
        token = jwt.sign({}, process.env.TOKEN_SECRET)
        res.cookie('view_history', token)
        view.token = token
    }

    view.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getViews = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
    if (req.cookies.view_history && !req.user.id) query.token = req.cookies.view_history
    reserved.forEach((el) => delete query[el])
    let queryPromise = View.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getViewById = (req, res) => {
    let { _id } = req.params
    View.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(200).json({ error: error.message })
    })
  }
  
const deleteViewById = (req, res) => {
    let { _id } = req.params
    View.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}
  
module.exports = {
    createView,
    getViews,
    getViewById,
    deleteViewById
}
const View = require("../models/view")
const jwt = require('jsonwebtoken');

// assume request has product
const createView = async (req, res) => {
    if (req.user.id) if (!req.user.cookies) return res.status(400).json({error: "User does not want cookies"})
    let { product } = req.body;
    if (!product) return res.status(400).json({ error: "Invalid input"})
    token = req.cookies.view_history
    let view = new View({ product })
    if (req.user.id) view.user = req.user.id
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
    if (req.user.id) if (!req.user.cookies) return res.status(200).json({ error: "User does not want cookies" })
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
    if (req.cookies.view_history && !req.user.id) query.token = req.cookies.view_history
    reserved.forEach((el) => delete query[el])
    let queryPromise = View.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))
    if (req.query.expand) req.query.expand.forEach((instance) => {
        instance = instance.split('.')
        if (instance.length > 1) return queryPromise.populate({ path: instance[0], populate: { path: instance[1] }})
        return queryPromise.populate(instance)
    })

    queryPromise.then((response) => {
        var items = [];
        if (response) {
            items.push(response[0]._id);
            for (var i = 1; i < response.length; i++) {
                if (items.includes(response[i]._id)) {
                    response.splice(i, 1);
                    i--;
                } else {
                    items.push(response[i]._id);
                }
            }
        }
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getViewById = (req, res) => {
    let { _id } = req.params
    let queryPromise = View.findById(_id)

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
const View = require("../models/view")
const crypto = require('crypto')

// assume request has product
const createView = async (req, res) => {
    let { p } = req.body;
    var token = req.cookies.view_history;
    if (!token) {
        token = generateViewToken(req.user.id);
        if (!token) {
            return req.status(404).json({error:"Could not create cookie"})
        } else {
            req.cookie("view_history", token)
            View.findOne({token:token.token}).then(function(err, vh){
                vh.addProduct(p)
            });
        }
    } else {
        View.findOne({token:token.token}).then(function(err, vh){
            vh.addProduct(p)
        });
    }
}

async function generateViewToken(id) {
    var token = crypto.randomBytes(128).toString;
    var f = 0;
    while (f == 0) {
        const v = await View.findOne({token:token});
        console.log(v)
        if (!v) {
            break;
        }
    }
    var view = new View();
    view.user = id;
    view.token = token;
    view.save().then(function(err) {
        if (err) {
        return null;
        } else {
        return {email:email,token:token};
        }
    });
}

const getViews = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    if (req.cookies.view_history) query.token = req.cookies.view_history
    reserved.forEach((el) => delete query[el])
    let queryPromise = View.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getViewById = (req, res) => {
    let { _id } = req.body
    View.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(200).json({ error: error.message })
    })
  }
  
const deleteViewById = (req, res) => {
    let { _id } = req.body
    View.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getUserViews = (req, res) => {
    const token = req.cookies.view_history;
    if (token) {
        View.find({token:token.token}).then((response) => {
            return res.status(200).json(response)
        }).catch((error) => {
            return res.status(200).json({ error: error.message })
        })
    }
}
  
module.exports = {
    createView,
    getViews,
    getViewById,
    deleteViewById,
    getUserViews
}
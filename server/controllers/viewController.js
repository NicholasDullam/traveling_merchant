const View = require("../models/view")

// assume request has product and user email
const createView = async (req, res) => {
    const token = req.cookies.view_history;
    if (!token) {
        token = generateViewToken(req.fields.email);
        if (!token) {
            return req.status(404).json({error:"Could not create cookie"})
        } else {
            req.cookie("view_history", token)
            View.findOne({token:token.token}).then(function(err, vh){
                vh.addProduct(req.p)
            });
        }
    } else {
        View.findOne({token:token.token}).then(function(err, vh){
            vh.addProduct(req.p)
        });
    }
}

const generateViewToken = (email) => {
    var token = crypto.randomBytes(128).toString;
    var f = 0;
    while (f == 0) {
        View.findOne({token:token}).then(function(err, vh){
        if (!err) {
            token = crypto.randomBytes(128).toString;
        } else {
            f = 1;
        }
        });
    }
    var user;
    User.findOne({email:email}).then(function(err, u){
        if (err) {
        user = null;
        } else {
        user = u;
        }
    });
    var view = new View();
    if (user) {
        view.user = user;
    }
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
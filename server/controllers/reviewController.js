const Review = require("../models/review");
const User = require("../models/user");
const Order = require("../models/order")

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    let { seller, rating, content } = req.body;
    const r = new Review();
    r.reviewer = req.user.id
    r.seller = seller
    r.rating = rating;
    r.content = content;
    if (verifyPurchase(r)) {
        r.save().then(function(r) {
            if (!r) {
            res.status(500).json({ error: "ERROR CREATING REVIEW"});
            } else {
            res.status(200).json({ error: "SUCCESS"});
            }
        })
    } else {
        res.status(500).json({ error: "ERROR CREATING REVIEW, NOT VERIFIED"});
    }
}

// method to verify purchase
const verifyPurchase = async function (r) {
    const o = await Order.findOne({buyer:r.reviewer,seller:r.seller})
    if (!o) {
        return false
    }
    return true
};

const getReviews = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Review.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    addReview,
    getReviews
}
const Review = require("../models/review");
const User = require("../models/user");

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    let { user, seller, rating, content } = req.fields;
    const r = new Review();
    User.findOne({email:user}, function(err,reviewer){
        if (err) {
            return req.status(500).json({message:"Invalid User"})
        }
        r.reviewer = reviewer
    })
    User.findOne({email:seller}, function(err,seller){
        if (err) {
            return req.status(500).json({message:"Invalid Seller"})
        }
        r.seller = seller
    })
    r.rating = rating;
    r.content = content;
    if (verifyPurchase(r)) {
        r.save().then(function(err) {
            if (err) {
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
const verifyPurchase = function (r) {
    Order.findOne({buyer:r.reviewer,seller:r.seller}, function (err, order) {
        if (!err) {
            return true;
        } else {
            return false;
        }
    })
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
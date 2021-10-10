const Review = require("../models/review");
const User = require("../models/user");

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    const r = new Review();
    User.findOne({email:req.body.email}, function(err,reviewer){
        if (err) {
            return req.status(500).json({message:"Invalid User"})
        }
        r.reviewer = reviewer
    })
    User.findOne({email:req.body.seller}, function(err,seller){
        if (err) {
            return req.status(500).json({message:"Invalid Seller"})
        }
        r.seller = seller
    })
    r.rating = req.body.rating;
    r.content = req.body.cont;
    r.save().then(function(err) {
        if (err) {
          res.status(500).json({ error: "ERROR CREATING REVIEW"});
        } else {
            Review.verifyPurchase(r)
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

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
const Review = require("../models/review");
const User = require("../models/user");

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    const r = new Review();
    User.findOne({email:req.email}, function(err,reviewer){
        if (err) {
            return req.status(500).json({message:"Invalid User"})
        }
        r.reviewer = reviewer
    })
    User.findOne({email:req.seller}, function(err,seller){
        if (err) {
            return req.status(500).json({message:"Invalid Seller"})
        }
        r.seller = seller
    })
    r.rating = req.rating;
    r.content = req.cont;
    r.save().then(function(err) {
        if (err) {
          res.status(500).json({ error: "ERROR CREATING REVIEW"});
        } else {
            Review.verifyPurchase(r)
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

module.exports = {
    addReview
}
const favorite = require("../models/favorite");
const User = require("../models/user");

// Assume request has product and user's email
const addfavorite = async (req, res) => {
    const f = new favorite();
    f.product_id = req.p;
    User.findOne({email:req.email}, function(err,u){
        if (err) {
            return req.status(500).json({message:"Invalid User"});
        }
        f.user_id = u;
    })
    f.save().then(function(err) {
        if (err) {
          res.status(500).json({ error: "ERROR CREATING FAVORITE"});
        } else {
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

module.exports = {
    addfavorite
}
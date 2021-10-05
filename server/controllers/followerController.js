const follower = require("../models/follower");
const User = require("../models/user");

// Assume request has follower's and following's email
const addFollower = async (req, res) => {
    const f = new follower();
    User.findOne({email:req.follower}, function(err,follower){
        if (err) {
            return req.status(500).json({message:"Invalid Follower"})
        }
        f.follower = follower
    })
    User.findOne({email:req.following}, function(err,following){
        if (err) {
            return req.status(500).json({message:"Invalid Following"})
        }
        f.following = following
    })
    f.save().then(function(err) {
        if (err) {
          res.status(500).json({ error: "ERROR CREATING FOLLOWER"});
        } else {
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

module.exports = {
    addFollower
}
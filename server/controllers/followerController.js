const follower = require("../models/follower");
const User = require("../models/user");

// Assume request has follower's and following's email
const addFollower = async (req, res) => {
    const f = new follower();
    User.findOne({email:req.fields.follower}, function(err,follower){
        if (err) {
            return req.status(500).json({message:"Invalid Follower"})
        }
        f.follower = follower
    })
    User.findOne({email:req.fields.following}, function(err,following){
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

const getFollowers = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = follower.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getUserFollowers = (req, res) => {
    const user = User.findById(req.user.id).exec();
    if (!user) return res.status(400).json({ error: 'Account not found'});
  
    follower.find({follower:user}).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
    
  }

module.exports = {
    addFollower,
    getFollowers,
    getUserFollowers
}
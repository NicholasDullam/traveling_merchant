const Follower = require("../models/follower");
const User = require("../models/user");

// Assume request has follower's and following's email
const createFollower = async (req, res) => {
    let {following} = req.body;
    const f = new Follower();
    f.follower = req.user.id;
    f.following = following;
    f.save().then(function(f) {
        if (!f) {
          res.status(500).json({ error: "ERROR CREATING FOLLOWER"});
        } else {
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

const getFollowers = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Follower.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getFollowerById = (req, res) => {
    let { _id } = req.params
    Follower.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(200).json({ error: error.message })
    })
}

const deleteFollowerById = (req, res) => {
    let { _id } = req.params
    Follower.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createFollower,
    getFollowers,
    getFollowerById,
    deleteFollowerById
}
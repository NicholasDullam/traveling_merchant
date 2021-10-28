const Follower = require("../models/follower");

const createFollower = async (req, res) => {
    let { following } = req.body;
    if (!following) return res.status(400).json({ error: "Invalid input"})
    const follower = new Follower({ follower: req.user.id, following })
    follower.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getFollowers = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Follower.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
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
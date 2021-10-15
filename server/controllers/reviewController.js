const Review = require("../models/review");
const User = require("../models/user");
const Order = require("../models/order")

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    let { seller, rating, content } = req.body;
    const review = new Review({ reviewer: req.user.id, seller, rating, content });
    let order = await Order.findOne({ buyer: req.user.id, seller })
    if (order) review.verified = true
    review.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
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

const getReviewById = (req, res) => {
    let { _id } = req.params
    Review.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const updateReviewById = (req, res) => {
    let { _id } = req.params
    Review.findByIdAndUpdate(_id, req.body, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deleteReviewById = (req, res) => {
    let { _id } = req.params
    Review.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    addReview,
    getReviews,
    getReviewById,
    updateReviewById,
    deleteReviewById
}
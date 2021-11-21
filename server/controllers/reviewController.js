const Review = require("../models/review");
const Order = require("../models/order");
const mongoose = require("mongoose");

// Assume request has user's email, the sellers email, the rating, and the content
const addReview = async (req, res) => {
    let { seller, rating, content } = req.body;
    if (!seller || !rating || !content) return res.status(400).json({ error: "Invalid input"})
    const review = new Review({ reviewer: req.user.id, seller, rating, content });
    let order = await Order.findOne({ buyer: req.user.id, seller })
    if (order) review.verified = true
    review.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getSort = (sortString) => {
    let direction = 1
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
}

const getReviews = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit'], pipeline = []
    reserved.forEach((el) => delete query[el])

    pipeline.push({ $match: query })
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    
    // paginate pipeline facet
    pipeline.push({
        $facet: {
            data: function paginate () {
                let data = []
                if (req.query.skip) data.push({ $skip: Number(req.query.skip) })
                if (req.query.limit) data.push({ $limit: Number(req.query.limit) })
                return data
            } (),
            results: [{ $count: 'count' }]
        }
    })

    //paginate pipeline count removal
    pipeline.push({
        $project: {
            data: '$data',
            results: { $arrayElemAt: [ "$results", 0 ]}
        }
    })

    Review.aggregate(pipeline).then((response) => {
        return res.status(200).json({ ...response[0], results: { ...response[0].results, has_more: (Number(req.query.skip) || 0) + (Number(req.query.limit) || 0) < response[0].results.count }})    
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getReviewRating = (req, res) => {
    let { _id } = req.params
    if (!_id) return res.status(400).json({ error: 'No user_id given' })
    Review.aggregate([
        {
            $match: {
                seller: mongoose.Types.ObjectId(_id)
            }
        },
        {
            $group: {
                _id: '$seller',
                avg: {
                    $avg: '$rating'
                }
            }
        }
    ]).then((response) => {
        if (response.length) return res.status(200).json(response[0])
        return res.status({ _id, avg: null })
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
        console.log(error)
        return res.status(400).json({ error: error.message })
    })
}

const verifyReviewById = async (req, res) => {
    if (!req.user.admin) return res.status(400).json({error:"Invalid Permissions"});
    let {_id} = req.params
    if (!_id) return res.status(400).json({error:"No id"});
    Review.findById(_id).then((doc) => {
        if (!doc) return res.status(400).json({error:"Could not find review"});
        Order.find({buyer:doc.reviewer,seller:doc.seller}).then((order) => {
            if (!order) {
                doc.verified = false;
                doc.save().then((response) => {
                    return res.status(200).json({message:"doc not verified",review:response})
                }).catch((err) => {
                    return res.status(400).json(err);
                })
            } else {
                doc.verified = true;
                doc.save().then((response) => {
                    return res.status(200).json({message:"Review verified",review:response})
                }).catch((err) => {
                    return res.status(400).json(err);
                })
            }
        }).catch((err) => {
            return res.status(400).json(err);
        })
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
    verifyReviewById,
    updateReviewById,
    deleteReviewById,
    getReviewRating
}
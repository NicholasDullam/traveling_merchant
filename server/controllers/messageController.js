const Message = require('../models/message')
const mongoose = require('mongoose')
const cheerio = require('cheerio')
const axios = require('axios')

const previewLink = async (req, res) => {
    let { url } = req.body
    let response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const getMeta = (tag) => {
        return (
            $(`meta[name=${tag}]`).attr('content') ||
            $(`meta[name="og:${tag}"]`).attr('content') ||
            $(`meta[name="twitter:${tag}"]`).attr('content') ||
            $(`meta[property=${tag}]`).attr('content') ||
            $(`meta[property="og:${tag}"]`).attr('content') ||
            $(`meta[property="twitter:${tag}"]`).attr('content')
        )
    }

    return res.status(200).json({
        url,
        title: getMeta('title'),
        img: getMeta('image'),
        description: getMeta('description')
    })
}

const getMessagesFromThread = (req, res) => {
    Message.find(
        { 
            $or: [
                { 
                    from: mongoose.Types.ObjectId(req.user.id),
                    to: mongoose.Types.ObjectId(req.params._id)            
                },
                {
                    from: mongoose.Types.ObjectId(req.params._id),
                    to: mongoose.Types.ObjectId(req.user.id)    
                }
            ] 
    }).sort('created_at').then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error })
    })
}

const getThreads = (req, res) => { 
    getThreadsHelper(req.user.id).then((response) => {
        res.status(200).json(response)
    }).catch((error) => {
        res.status(200).json({ error: error.message })
    })
}

const getThreadsHelper = async (user_id) => {
    return Message.aggregate([
        {
            $match: {
                $or: [
                    {
                        from: mongoose.Types.ObjectId(user_id)
                    },
                    {
                        to: mongoose.Types.ObjectId(user_id)
                    }
                ]
            }
        },
        { 
            $group: {
                _id: "$from",
                unread: { 
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    {
                                        $eq: ["$read", false]
                                    },
                                    {
                                        $ne: ["$from", user_id]
                                    }
                                ]
                            }, 1, 0
                        ]
                    }
                },
                last_active_at: { $max: "$created_at" }
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $sort: {
                last_active_at: 1
            }
        },
        { 
            $project: {
                _id: "$_id",
                unread: "$unread",
                last_active_at: "$last_active_at",
                user: { $arrayElemAt: [ "$user", 0 ]}
            }
        }
    ])
}

module.exports = {
    previewLink,
    getMessagesFromThread,
    getThreads,
    getThreadsHelper
}
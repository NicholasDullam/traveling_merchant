const Message = require('../models/message')
const mongoose = require('mongoose')

const getMessagesFromThread = (req, res) => {
    console.log(req.params)
    Message.find({ $or: [
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
    Message.aggregate([
        {
            $match: {
                $or: [
                    {
                        from: mongoose.Types.ObjectId(req.user.id)
                    },
                    {
                        to: mongoose.Types.ObjectId(req.user.id)
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
                                        $ne: ["$from", req.user.id]
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
                last_active_at: -1
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
    ]).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })   
}

module.exports = {
    getMessagesFromThread,
    getThreads
}
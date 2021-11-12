const mongoose = require('mongoose')
const Notification = require('./notification') 

// Follower Schema

const Follower = new mongoose.Schema({
    follower: { type:mongoose.Types.ObjectId, ref: 'User' },
    following: { type:mongoose.Types.ObjectId, ref: 'User' },
    notifications: { type: Boolean, default: true }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

Follower.post('save', async (doc, next) => {
    let notification = new Notification({
        sender: doc.follower, 
        receiver: doc.following,
        type: 'follower',
        content: 'New follower',
        metadata: {
            user_id: doc.follower
        }
    })

    await notification.save()
    next()
})

module.exports = mongoose.model('Follower', Follower)
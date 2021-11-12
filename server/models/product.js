const mongoose = require('mongoose');
const Follower = require('./follower')
const Notification = require('./notification')

// Product Schema

const Product = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Types.ObjectId, ref: 'Game' },
    media: [ String ],
    name: String,
    type: String,
    platform: String,
    server: String,
    delivery_type: String,
    delivery_speed: Number,
    description: String,
    unit_price: Number,
    min_quantity: Number,
    stock: Number,
    private: Boolean,
    follower_only: Boolean,
    requirements: {
        //...
    },
    attributes: {
        //...
    },
    metadata: {
        //...
    }
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// create notification for followers 
Product.post('save', async (doc, next) => {
    let followers = await Follower.find({ following: doc.user_id })
    followers.forEach(async (follower) => {
        let notification = new Notification({
            sender: doc.user_id, 
            receiver: follower.follower,
            type: 'product',
            content: 'New product listing',
            metadata: {
                product_id: doc._id
            }
        })

        await notification.save()
    })

    next()
})

module.exports = mongoose.model('Product', Product);
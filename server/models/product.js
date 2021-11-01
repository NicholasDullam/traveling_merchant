const mongoose = require('mongoose');
const Follower = require('./follower')
const Notification = require('./notification')

// Product Schema

const Product = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref:'User' },
    game_id: { type: mongoose.Types.ObjectId, ref:'Game' },
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
    let followers = await Follower.find({ following: doc.seller })
    followers.forEach(async (follower) => {
        let notification = new Notification({
            sender: doc.seller, 
            receiver: follower.follower,
            link: process.env.NODE_ENV === 'production' ? `${process.env.ORIGIN}/products/${doc._id}` : `localhost:3000/orders/${doc._id}`, 
            type: 'product'
        })

        await notification.save()
    })

    next()
})

module.exports = mongoose.model('Product', Product);
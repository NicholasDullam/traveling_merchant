var mongoose = require('mongoose');

// Product Schema

const Product = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref:'User' },
    game_id: { type: mongoose.Types.ObjectId, ref:'Game'},
    name: String,
    type: String,
    delivery_type: String,
    delivery_speed: Number,
    description: String,
    media: [ String ],
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

module.exports = mongoose.model('Product', Product);
var mongoose = require('mongoose');

// Order Schema

const Order = new mongoose.Schema({
    buyer: { type: mongoose.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
    pi_id: String,
    tr_id: String,
    status: String,
    custom: Boolean,
    refunded: Boolean,
    last_delivered_at: Date,
    auto_confirm_at: Date,
    confirmed_at: Date,
    unit_price: Number,
    quantity: Number,
    earnings: Number,
    requirements: Object,
    metadata: Object
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Order', Order);
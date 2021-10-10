var mongoose = require('mongoose');
var Order = require('./order')

// Review Schema

const Review = new mongoose.Schema({
    reviewer: { type: mongoose.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
    rating: Number,
    content: String,
    verified: Boolean
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Review', Review);
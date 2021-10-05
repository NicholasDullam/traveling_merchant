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

// method to verify purchase
Review.methods.verifyPurchase = function (r) {
    Order.findOne({buyer:r.reviewer,seller:r.seller}, function (err, order) {
        if (!err) {
            r.verfied = true;
        } else {
            r.verfied = false;
        }
    })
};

Review.methods.init = function () {};
module.exports = mongoose.model('Review', Review);
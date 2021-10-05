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
Review.methods.verifyPurchase = function () {
    Order.findOne({buyer:this.reviewer,seller:this.seller}, function (err, order) {
        if (!err) {
            this.verfied = true;
        } else {
            this.verfied = false;
        }
    })
};

Review.methods.init = function () {};
module.exports = mongoose.model('Review', Review);
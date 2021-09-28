var mongoose = require('mongoose');

var Order = require('./ordermodel')

// Review Schema

const reviewSchema = new mongoose.Schema({
    reviewer: {type:mongoose.Types.ObjectId,ref:'User'},
    seller: {type:mongoose.Types.ObjectId,ref:'User'},
    rating: Number,
    content: String,
    verfied: Boolean,
    created_at: Date,
    updated_at: Date
});

// method to verify purchase
reviewSchema.methods.verifyPurchase = function () {
    Order.findOne({buyer:this.reviewer,seller:this.seller}, function (err, order) {
        if (!err) {
            this.verfied = true;
        } else {
            this.verfied = false;
        }
    })
};

reviewSchema.methods.init = function () {};
module.exports = mongoose.model('Review', reviewSchema);
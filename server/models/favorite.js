var mongoose = require('mongoose');

// Favorite Schema

const Favorite = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

Favorite.methods.init = function () {};
module.exports = mongoose.model('Favorite', Favorite);
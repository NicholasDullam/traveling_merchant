const mongoose = require('mongoose');

const Favorite = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Favorite', Favorite);
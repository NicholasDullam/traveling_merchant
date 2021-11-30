const mongoose = require('mongoose');

const View = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
    token: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('View', View)
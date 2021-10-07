var mongoose = require('mongoose');

// view history schema

const View = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    products: { type: mongoose.Types.ObjectId, ref: 'Product' },
    token: String
});

module.exports = mongoose.model('View', View)
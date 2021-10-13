var mongoose = require('mongoose');

// view history schema

const View = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    token: String
});

// Method to add product
View.methods.addProduct = function addProduct(p) {
    this.products.append(p)
};

module.exports = mongoose.model('View', View)
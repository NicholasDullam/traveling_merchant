var mongoose = require('mongoose');

// view history schema

const View = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
    token: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Method to add product
View.methods.addProduct = function addProduct(p) {
    this.products.append(p)
};

module.exports = mongoose.model('View', View)
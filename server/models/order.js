var mongoose = require('mongoose');

// Order Schema

const Order = new mongoose.Schema({
    buyer: { type: mongoose.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: String,
    custom: Boolean,
    delivered: Boolean,
    delivered_at: Date,
    total: Number,
    products: [{
        product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    requirements: {
        //...
    },
    metadata: {
        //...
    }
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Method to add product
Order.methods.addProduct = function addProduct(p, n) {
    this.products[this.products.length] = {product_id:p,quantity:n};
};

// Method to remove product
Order.methods.removeProduct = function removeProduct(v) {
    var i;
    for (i = 0; i < this.products.length; i++) {
        if (v = this.products[i]) {
        this.products[i] = null;
        break;
        }
    }
    if (i != this.products.length) {
        while (i != this.products.length - 1) {
        this.products[i] = this.products[i+1];
        i++;
        }
    }
};

// Method to mark as delivered
Order.methods.markAsDelivered = function markAsDelivered() {
    this.delivered = true;
    this.delivered_at = new Date();
};

Order.methods.init = function () {};
module.exports = mongoose.model('Order', Order);
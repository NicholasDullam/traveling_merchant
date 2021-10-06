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
        unit_price: Number,
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
    this.products.append({ product_id: p, quantity: n })
};

// Method to remove product
Order.methods.removeProduct = function removeProduct(v) {
    this.products = this.products.filter((product) => product != v)
};

// Method to mark as delivered
Order.methods.markAsDelivered = function markAsDelivered() {
    this.delivered = true;
    this.delivered_at = new Date();
};

module.exports = mongoose.model('Order', Order);
var mongoose = require('mongoose');

// Product Schema

const Product = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref:'User' },
    name: String,
    type: String,
    delivery_type: String,
    description: String,
    media: [ String ],
    unit_price: Number,
    min_quantity: Number,
    stock: Number,
    private: Boolean,
    follower_only: Boolean,
    requirements: {
        //...
    },
    attributes: {
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

// Method to add media
Product.methods.addMedia = function addMedia(v) {
    this.media.append(v)
};

// Method to remove media
Product.methods.removeMedia = function removeMedia(v) {
    this.media = this.media.filter((media) => media != v)
}

module.exports = mongoose.model('Product', Product);
var mongoose = require('mongoose');

// Product Schema

const productSchema = new mongoose.Schema({
    user_id: {type:mongoose.Types.ObjectId,ref:'User'},
    name: String,
    type: String,
    delivery_type: String,
    description: String,
    media: [ String ],
    unit_price: Number,
    min_quantity: Number,
    stock: Number,
    private: Boolean,
    followers_only: Boolean,
    requirements: {
        //...
    },
    attributes: {
        //...
    },
    metadata: {
        //...
    },
    created_at: Date,
    updated_at: Date
});

// Method to add media
productSchema.methods.addMedia = function addMedia(v) {
    this.media[this.media.length] = v;
};

// Method to remove media
productSchema.methods.removeMedia = function removeMedia(v) {
    var i;
    for (i = 0; i < this.media.length; i++) {
        if (v = this.media[i]) {
        this.media[i] = null;
        break;
        }
    }
    if (i != this.media.length) {
        while (i != this.media.length - 1) {
        this.media[i] = this.media[i+1];
        i++;
        }
    }
};

productSchema.methods.init = function () {};
module.exports = mongoose.model('Product', productSchema);
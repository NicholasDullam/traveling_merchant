var mongoose = require('mongoose');

// Favorite Schema

const favoriteSchema = new mongoose.Schema({
    user_id: {type:mongoose.Types.ObjectId,ref:'User'},
    product_id: {type:mongoose.Types.ObjectId,ref:'User'},
    created_at: Date
});

favoriteSchema.methods.init = function () {};
module.exports = mongoose.model('Favorite', favoriteSchema);
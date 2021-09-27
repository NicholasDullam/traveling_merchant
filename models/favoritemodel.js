var mongoose = require('mongoose');

// Favorite Schema

const favoriteSchema = new mongoose.Schema({
    user_id: userSchema,
    product_id: productSchema,
    created_at: Date
});

favoriteSchema.methods.init = function () {};
module.exports = mongoose.model('Favorite', favoriteSchema);
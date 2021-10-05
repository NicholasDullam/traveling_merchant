var mongoose = require('mongoose');

// Game Schema

const Game = new mongoose.Schema({
    name: String,
    developer: String,
    product_types: [ String ],
    platforms: [ String ],
    img: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

Game.methods.init = function () {};
module.exports = mongoose.model('Game', Game);
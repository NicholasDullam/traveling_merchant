const mongoose = require('mongoose');

const Game = new mongoose.Schema({
    name: String,
    developer: String,
    product_types: [ String ],
    platforms: [ String ],
    servers: [ String ], 
    banner_img: String,
    img: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('Game', Game);
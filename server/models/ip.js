var mongoose = require('mongoose');

// Ip Schema

const Ip = new mongoose.Schema({
    ip: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('Ip', Ip);
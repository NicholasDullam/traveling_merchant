var mongoose = require('mongoose');

// Filter Schema

const Filter = new mongoose.Schema({
    word: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'   
    }
});

module.exports = mongoose.model('Filter', Filter);
const mongoose = require('mongoose');

const Filter = new mongoose.Schema({
    word: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'   
    }
});

module.exports = mongoose.model('Filter', Filter);
const mongoose = require('mongoose');
const io = require('../')

// Notification Schema
const Notification = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Types.ObjectId, ref: 'User' },
    type: String,
    link: String,
    content: String,
    seen: Boolean,
    seen_at: Date,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Notification', Notification);
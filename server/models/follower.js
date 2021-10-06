var mongoose = require('mongoose');

// Follower Schema

const Follower = new mongoose.Schema({
    follower: { type:mongoose.Types.ObjectId, ref: 'User' },
    following: { type:mongoose.Types.ObjectId, ref: 'User' },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Follower', Follower)
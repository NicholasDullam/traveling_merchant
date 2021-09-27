var mongoose = require('mongoose');

// Follower Schema

const followerSchema = new mongoose.Schema({
    follower: userSchema,
    following: userSchema,
    created_at: Date
});

followerSchema.methods.init = function () {};
module.exports = mongoose.model('Follower', followerSchema);
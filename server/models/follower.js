var mongoose = require('mongoose');

// Follower Schema

const Follower = new mongoose.Schema({
    follower: {type:mongoose.Types.ObjectId,ref:'User'},
    following: {type:mongoose.Types.ObjectId,ref:'User'},
    created_at: Date
});

Follower.methods.init = function () {};
module.exports = mongoose.model('Follower', Follower);
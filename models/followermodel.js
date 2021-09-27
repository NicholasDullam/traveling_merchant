var mongoose = require('mongoose');

// Follower Schema

const followerSchema = new mongoose.Schema({
    follower: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    following: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    created_at: Date
});

followerSchema.methods.init = function () {};
module.exports = mongoose.model('Follower', followerSchema);
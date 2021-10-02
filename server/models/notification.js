var mongoose = require('mongoose');

// Notification Schema

const Notification = new mongoose.Schema({
    receiver: {type:mongoose.Types.ObjectId,ref:'User'},
    sender: {type:mongoose.Types.ObjectId,ref:'User'},
    content: String,
    seen: Boolean,
    seen_at: Date,
    created_at: Date
});

// Method to mark as seen
Notification.methods.markAsSeen = function markAsSeen() {
    this.seen = true;
    this.seen_at = new Date();
}

Notification.methods.init = function () {};
module.exports = mongoose.model('Notification', Notification);
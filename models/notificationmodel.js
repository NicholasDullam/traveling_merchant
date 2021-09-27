var mongoose = require('mongoose');

// Notification Schema

const notificationSchema = new mongoose.Schema({
    receiver: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    sender: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    content: String,
    seen: Boolean,
    seen_at: Date,
    created_at: Date
});

// Method to mark as seen
notificationSchema.methods.markAsSeen = function markAsSeen() {
    this.seen = true;
    this.seen_at = new Date();
}

notificationSchema.methods.init = function () {};
module.exports = mongoose.model('Notification', notificationSchema);
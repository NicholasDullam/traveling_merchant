var mongoose = require('mongoose');

// Message Schema

const messageSchema = new mongoose.Schema({
    to: userSchema,
    from: userSchema,
    content: String,
    attachments: [ String ],
    read: Boolean,
    read_at: Date,
    created_at: Date,
    updated_at: Date
});

// Method to mark as read
messageSchema.methods.markAsRead = function markAsRead() {
    this.read = true;
    this.read_at = new Date();
};

messageSchema.methods.init = function () {};
module.exports = mongoose.model('Message', messageSchema);
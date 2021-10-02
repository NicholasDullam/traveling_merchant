var mongoose = require('mongoose');

// Message Schema

const Message = new mongoose.Schema({
    to: {type:mongoose.Types.ObjectId,ref:'User'},
    from: {type:mongoose.Types.ObjectId,ref:'User'},
    content: String,
    attachments: [ String ],
    read: Boolean,
    read_at: Date,
    created_at: Date,
    updated_at: Date
});

// Method to mark as read
Message.methods.markAsRead = function markAsRead() {
    this.read = true;
    this.read_at = new Date();
};

messageSchema.methods.init = function () {};
module.exports = mongoose.model('Message', Message);
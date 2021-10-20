var mongoose = require('mongoose');

// Notification Schema

const Notification = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref:'User' },
    receiver: { type: mongoose.Types.ObjectId, ref:'User' },
    type: String,
    content: String,
    seen: Boolean,
    seen_at: Date,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Method to mark as seen
Notification.methods.markAsSeen = function markAsSeen() {
    this.seen = true;
    this.seen_at = new Date();
}

module.exports = mongoose.model('Notification', Notification);
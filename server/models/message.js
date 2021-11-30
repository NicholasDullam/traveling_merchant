const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    to: { type: mongoose.Types.ObjectId, ref: 'User' },
    from: { type: mongoose.Types.ObjectId, ref: 'User' },
    content: String,
    attachments: [ String ],
    read: { type: Boolean, default: false },
    read_at: Date
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('Message', Message);
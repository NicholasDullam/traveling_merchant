const mongoose = require('mongoose');
const User = require('./user');
const nodeMailer = require('nodemailer')

// Notification Schema
const Notification = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Types.ObjectId, ref: 'User' },
    type: String,
    content: String,
    seen: Boolean,
    seen_at: Date,
    metadata: Object
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

Notification.post('save', async (doc, next) => {
    let receiver = await User.findById(doc.receiver)
    let transport = nodeMailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })

    let mailer = {
        to : receiver.email,
        from : process.env.EMAIL,
        subject: 'New Notification',
        html : '<h1>You have a new notification :D</h1>'
    }

    await transport.sendMail(mailer)
    next()
})

module.exports = mongoose.model('Notification', Notification);
const jwt = require('jsonwebtoken');
const token_secret = process.env.TOKEN_SECRET;
const Notification = require("../models/notification");
const User = require("../models/user")
const Message = require('../models/message');
const { getThreadsHelper } = require('../controllers/messageController');
let status = {}

module.exports = (io) => {
    Notification.watch().on('change', async (doc) => {
        console.log('testing', doc)
        if (doc.operationType === 'insert') {
            console.log('sending', doc.fullDocument)
            io.to(doc.fullDocument.receiver.toString()).emit('notification', doc.fullDocument)
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            socket.user = jwt.verify(token, token_secret);
            if (socket.user.banned) return next(new Error('banned'))
            next()
        } catch (error) {
            return next(new Error('error validating token'))
        }
    })
    
    io.on('connection', (socket) => {
        socket.join(socket.user.id)
        io.to(socket.user.id).emit('success', { user_id: socket.user.id })
        status[socket.user.id] = 'online'

        // update user status to online
        User.findByIdAndUpdate(socket.user.id, { status: status[socket.user.id] }).then(async (response) => {
            let threads = await getThreadsHelper(socket.user.id)
            threads.forEach((thread) => {
                if (thread.user) socket.to(thread.user._id.toString()).emit('status', {
                    thread_id: socket.user.id,
                    status: status[socket.user.id]
                })
            })
        }).catch((error) => {
            socket.to(socket.user.id).emit('error', { error })
        })

        // disconnect handler
        socket.on('disconnect', () => {
            status[socket.user.id] = 'offline'
            User.findByIdAndUpdate(socket.user.id, { status: status[socket.user.id] }, { new: true }).then(async (response) => {
                let threads = await getThreadsHelper(socket.user.id)
                threads.forEach((thread) => {
                    if (thread.user) socket.to(thread.user._id.toString()).emit('status', {
                        thread_id: socket.user.id,
                        status: status[socket.user.id]
                    })
                })
            }).catch((error) => {
                socket.to(socket.user.id).emit('error', { error })
            })
        })

        // status handler
        socket.on('status', (status) => {
            socket[socket.user.id] = status       
            User.findByIdAndUpdate(socket.user.id, { status: status[socket.user.id] }).then(async (response) => {
                let threads = await getThreadsHelper(socket.user.id)
                threads.forEach((thread) => {
                    if (thread.user) socket.to(thread.user._id.toString()).emit('status', {
                        thread_id: socket.user.id,
                        status: status[socket.user.id]
                    })
                })
            }).catch((error) => {
                socket.to(socket.user.id).emit('error', { error })
            })
        })

        socket.on('read', (thread_id) => {
            Message.updateMany({ from: thread_id, to: socket.user.id, unread: true }, { read: true, read_at: new Date() }, { new: true }).then((response) => {
                socket.to(thread_id).emit('read', {
                    thread_id: socket.user.id,
                    messages: response
                })
            }).catch((error) => {
                socket.to(socket.user.id).emit('error', { error })
            })
        })
    
        // message handler
        socket.on('message', (msg) => {
            if (msg.from !== socket.user.id) return io.emit('error', { error: 'Attempting to message from a different alias' })
            let message = new Message(msg)
            message.save().then(async (response) => {
                io.to(socket.user.id).emit('message_sent', response)
                io.to(response.to.toString()).emit('message_received', response)
                if (status[socket.user.id] === 'online') return
                let notification = new Notification({
                    sender: socket.user.id,
                    receiver: response.to.toString(),
                    type: 'message',
                    content: response.content,
                    link: ''
                }) 

                await notification.save()
            }).catch((error) => {
                io.to(socket.user.id).emit('error', { error })
            })
        })
    })
}
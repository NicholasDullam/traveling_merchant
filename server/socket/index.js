const jwt = require('jsonwebtoken');
const token_secret = process.env.TOKEN_SECRET;
const Notification = require("../models/notification")

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const data = jwt.verify(token, token_secret);
        socket.user = data
        if (socket.user.banned) return next(new Error('banned'))
        next()
    } catch {
        return next(new Error('error validating token'))
    }
});

io.on('connection', (socket) => {
    socket.join(socket.user.id);

    Notification.find({receiver:socket.user.id,seen:false}).then((response) => {
        response.forEach(notif => {
            io.to(socket.user.id).emit('notification', {
                to:notif.receiver,
                from:notif.sender,
                type:notif.type,
                content:notif.content
            });
        });
    }).catch((error) => {
        io.to(socket.user.id).emit('error', {
            error:error
        });
    })

    socket.on('message', (msg) => {
        var n = new Notification({
            sender:msg.from,
            receiver:msg.to,
            type:msg.type,
            content:msg.content,
            seen:false
        });
        n.save().then().catch((error) => {
            console.log(error)
            io.to(socket.user.id).emit('error', {
                error:error
            });
        })
        io.to(msg.to).emit('notification', {
            to:msg.to,
            from:msg.from,
            type:msg.type,
            content:msg.content
        });
    });
});
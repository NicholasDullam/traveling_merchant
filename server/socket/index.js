const jwt = require('jsonwebtoken');
const token_secret = process.env.TOKEN_SECRET;
const Notification = require("../models/notification")
var online = [];

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8000",
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
    if (online.indexOf(socket.user.id) != -1) {
        online.push(socket.user.id);
    }
    io.to(socket.user.id).emit('success', {
        userid:socket.user.id
    });

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
        io.to(msg.to).to(socket.user.id).emit('notification', {
            to:msg.to,
            from:msg.from,
            type:msg.type,
            content:msg.content,
            id:n._id
        });
    });

    socket.on('online', (user) => {
        if (online.indexOf(user) != -1) {
            socket.to(socket.user.id).emit('online', {
                user:user,
                online:true
            })
        } else {
            socket.to(socket.user.id).emit('online', {
                user:user,
                online:false
            })
        }
    });

    socket.on('read', (msg) => {
        Notification.findById(msg.id).then((response) => {
            response.seen = true;
            response.save().catch((error) => {
                console.log(error)
                io.to(socket.user.id).emit('error', {
                    error:error
                });
            })
        }).catch((error) => {
            io.to(socket.user.id).emit('error', {
                error:error
            });
        })
    });

    socket.on('disconnect', () => {
        var i = online.indexOf(socket.user.id);
        if (i != -1) {
            online.splice(i, 1);
        }
    });
});
const jwt = require('jsonwebtoken');
const token_secret = process.env.TOKEN_SECRET;
const Notification = require("../models/notification");
const User = require("../models/user")
var online = [];

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

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

    // first join room
    socket.join(socket.user.id);

    // check if already online, else push onto online
    if (online.indexOf(socket.user.id) != -1) {
        online.push(socket.user.id);
    }

    // tell the user they successfully connected
    io.to(socket.user.id).emit('success', {
        userid:socket.user.id
    });

    // tell user who is online
    User.findById(socket.user.id).then((response) => {
        if (response) {
            response.chatrooms.forEach((user) => {
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
            })
        } else {
            io.to(socket.user.id).emit('error', {
                error:"Invalid user"
            });
        }
    }).catch((error) => {
        io.to(socket.user.id).emit('error', {
            error:error
        });
    });

    // message handler
    socket.on('message', (msg) => {
        // add to the sender's chatroom
        User.findById(socket.user.id).then((response) => {
            if (response) {
                if (response.chatrooms.indexOf(msg.to) == -1) {
                    response.chatrooms.push(msg.to);
                    response.save().then().catch((error) => {
                        console.log(error);
                        io.to(socket.user.id).emit('error', {
                            error:error
                        });
                    })
                }
            } else {
                io.to(socket.user.id).emit('error', {
                    error:"couldnt disconnect"
                });
            }
        }).catch((error) => {
            io.to(socket.user.id).emit('error', {
                error:error
            });
        });
        // add to the receiver's chatroom
        User.findById(msg.to).then((response) => {
            if (response) {
                if (response.chatrooms.indexOf(socket.user.id) == -1) {
                    response.chatrooms.push(socket.user.id);
                    response.save().then().catch((error) => {
                        console.log(error);
                        io.to(socket.user.id).emit('error', {
                            error:error
                        });
                    })
                }
            } else {
                io.to(socket.user.id).emit('error', {
                    error:"couldnt disconnect"
                });
            }
        }).catch((error) => {
            io.to(socket.user.id).emit('error', {
                error:error
            });
        });
        // make notification
        var n = new Notification({
            sender:socket.user.id,
            receiver:msg.to,
            type:msg.type,
            content:msg.content,
            seen:false
        });
        n.save().then().catch((error) => {
            console.log(error);
            io.to(socket.user.id).emit('error', {
                error:error
            });
        });
        // forward notification
        io.to(msg.to).to(socket.user.id).emit('notification', {
            to:msg.to,
            from:socket.user.id,
            type:msg.type,
            content:msg.content,
            id:n._id
        });
    });

    // online handler
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

    // read handler
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

    // disconnect handler
    socket.on('disconnect', () => {
        var i = online.indexOf(socket.user.id);
        if (i != -1) {
            online.splice(i, 1);
        }
        User.findById(socket.user.id).then((response) => {
            if (response) {
                response.chatrooms.forEach((user) => {
                    socket.to(user).emit('online', {
                        user:socket.user.id,
                        online:false
                    })
                })
            } else {
                io.to(socket.user.id).emit('error', {
                    error:"couldnt disconnect"
                });
            }
        }).catch((error) => {
            io.to(socket.user.id).emit('error', {
                error:error
            });
        });
    });
});

module.exports = io;
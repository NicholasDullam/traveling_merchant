import { io } from "socket.io-client";

// URL of server
const URL = "http://localhost:8000";
const socket = io(URL, { autoConnect: false });
var connected = false;
var user;
var uonline = [];

function connect(token) {
    socket.auth = token;
    socket.connect();
};

// id is message id
function read(id) {
    if (connected) {
        socket.emit('read', {
            id:id
        });
    } else {
        console.log("Not connected.");
    }
}

// id is requested user's id
function online(id) {
    if (connected) {
        socket.emit('online', id);
    } else {
        console.log("Not connected.");
    }
}

function message(to, type, content) {
    if (connected) {
        socket.emit({
            to:to,
            from:user,
            type:type,
            content:content
        })
    } else {
        console.log("Not connected.");
    }
}

socket.on('connect_error', (err) => {
    console.log(err);
});

socket.on('error', (err) => {
    console.log(err);
});

socket.on('notification', (msg) => {
    /*
     * Case:
     *    1: on chat page and looking at chat where the notification came from
     *       - push message into chat and emit 'read' w/ message id
     *    2: on chat page and not looking at chat where notification came from
     *       - make an unread marker next to sender on chat page
     *    3: not on chat page and not looking at notification drop down
     *       - create notification pop-up and add to notification list
     *    4: not on chat page and looking at notification drop down
     *       - add notification to list
     *    5: from self (update the chat, this is for other tabs)
     * 
     *    params: to, from, type, content, id
    */
});

socket.on('online', (res) => {
    var i = uonline.indexOf(res.user);
    if (i !== -1 && res.online === false) {
        uonline.splice(i, 1);
    } else if (i === -1 && res.online === true) {
        uonline.push(res.user);
    }
})

socket.on('success', (res) => {
    connected = true;
    user = res.userid;
});
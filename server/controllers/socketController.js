const Notification = require("../models/notification")
const User = require("../models/user")

const getToFrom = (req, res) => {
    let {from} = req.params
    Notification.find({receiver:req.user.id,sender:from}).sort({date: 'descending'}).exec((err, docs) => { 
        if (!err) {
            res.status(200).json(docs);
        } else {
            res.status(400).json({
                error: err
            });
        }
    }).catch((err) => {
        res.status(400).json({
            error: err
        });
    })
}

const getUnread = (req, res) => {
    Notification.find({receiver:req.user.id,seen:false}).sort({date: 'descending'}).exec((err, docs) => { 
        if (!err) {
            res.status(200).json(docs);
        } else {
            res.status(400).json({
                error: err
            });
        }
    }).catch((err) => {
        res.status(400).json({
            error: err
        });
    })
}

const getChatrooms = (req, res) => {
    User.findById(req.user.id).then((response) => {
        if (response) {
            res.status(200).json(response.chatrooms);
        } else {
            res.status(400).json({
                error: err
            });
        }
    }).catch((err) => {
        res.status(400).json({
            error: err
        });
    })
}

const removeFromChat = (req, res) => {
    let { userid } = req.body;
    User.findById(req.user.id).then((response) => {
        if (response) {
            if (response.chatrooms.indexOf(userid) != -1) {
                response.chatrooms.splice(response.chatrooms.indexOf(userid), 1);
                return res.status(200);
            }
        } else {
            res.status(400).json({
                error: err
            });
        }
    }).catch((err) => {
        res.status(400).json({
            error: err
        });
    })
}

module.exports = {
    getToFrom,
    getChatrooms,
    getUnread,
    removeFromChat
}
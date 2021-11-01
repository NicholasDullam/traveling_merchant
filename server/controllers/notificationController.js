const Notification = require('../models/notification')

const getNotifications = (req, res) => {
    Notification.find({ receiver: req.user.id }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    getNotifications
}
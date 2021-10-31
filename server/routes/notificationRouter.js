const express = require('express')

const NotificationController = require('../controllers/notificationController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/notifications', auth, NotificationController.getNotifications)

module.exports = router
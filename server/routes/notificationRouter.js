const express = require('express')

const NotificationController = require('../controllers/notificationController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/notifications', auth, NotificationController.getNotifications)
router.post('/notifications/clear', auth, NotificationController.clearNotifications)
router.delete('/notifications/:_id', auth, NotificationController.deleteNotificationById)

module.exports = router
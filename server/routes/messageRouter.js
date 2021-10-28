const express = require('express')

const MessageController = require('../controllers/messageController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/messages/threads', auth, MessageController.getThreads)

module.exports = router
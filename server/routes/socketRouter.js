const express = require('express')

const socketController = require('../controllers/socketController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

router.get('/getUnread', auth, isBanned, socketController.getUnread);
router.get('/getChatrooms', auth, isBanned, socketController.getChatrooms);
router.get('/getTo/:from', auth, isBanned, socketController.getToFrom);
router.post('/removeFromChat', auth, isBanned, socketController.removeFromChat);

module.exports = router
const express = require('express')

const socketController = require('../controllers/socketController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

router.get('/getUnread', auth, socketController.getUnread);
router.get('/getChatrooms', auth, socketController.getChatrooms);
router.get('/getTo/:from', auth, socketController.getToFrom);
router.post('/removeFromChat', auth, socketController.removeFromChat);

module.exports = router
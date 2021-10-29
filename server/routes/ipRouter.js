const express = require('express')

const IpController = require('../controllers/ipController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

// POST requests
router.post('/banIp', auth, IpController.addBanned) // add ip to ban list
router.post('/unbanIp', auth, IpController.removeBanned) // delete ip from ban list

module.exports = router
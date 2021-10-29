const express = require('express')

const LoginController = require('../controllers/loginController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// POST requests
router.post('/banIp', auth, LoginController.banIp) // ban ip
router.post('/unbanIp', auth, LoginController.unbanIp) // unban ip
router.post('/unbanUserLogins', auth, LoginController.unbanUserLogins) // unban user
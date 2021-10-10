const express = require('express')

const AuthController = require('../controllers/authController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/auth/login', AuthController.login)
router.post('/auth/logout', AuthController.logout)
router.post('/auth/banUser', auth, AuthController.banUser)
router.post('/auth/removeUser', auth, AuthController.removeUser)

module.exports = router
const express = require('express')

const AuthController = require('../controllers/authController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// POST requests
router.post('/auth/login', AuthController.login) // email and password login
router.post('/auth/token', auth, AuthController.verifyToken) // token verification
router.post('/auth/logout', AuthController.logout) // logout user

module.exports = router
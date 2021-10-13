const express = require('express')

const AuthController = require('../controllers/authController')

const router = express.Router()

// POST requests
router.post('/auth/login', AuthController.login) // email and password login
router.post('/auth/logout', AuthController.logout) // logout user

module.exports = router
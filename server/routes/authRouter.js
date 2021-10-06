const express = require('express')

const AuthController = require('../controllers/authController')

const router = express.Router()

router.post('/auth/login', AuthController.login)
router.post('/auth/logout', AuthController.logout)

module.exports = router
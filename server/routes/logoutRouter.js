const express = require('express')

const AuthController = require('../controllers/logoutController')

const router = express.Router()

router.post('/logout', logoutController.logout)

module.exports = router
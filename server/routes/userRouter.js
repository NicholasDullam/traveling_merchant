const express = require('express')

const UserController = require('../controllers/userController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/user', auth, UserController.createUser)

module.exports = router
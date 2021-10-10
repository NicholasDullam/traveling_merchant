const express = require('express')

const UserController = require('../controllers/userController')

const router = express.Router()

router.post('/user', UserController.createUser)
router.get('/user', auth, UserController.getUsers)

module.exports = router
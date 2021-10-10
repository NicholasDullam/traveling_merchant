const express = require('express')

const UserController = require('../controllers/userController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/users', auth, UserController.getUsers) // get users
router.get('/user/:id', auth, UserController.getUserById) // get user by id

// POST requests
router.post('/users', UserController.createUser) // create user

// PUT requests
router.put('/user/:id', auth, UserController.updateUserById) // update user by id

module.exports = router
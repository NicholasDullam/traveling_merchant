const express = require('express')

const UserController = require('../controllers/userController')
const { auth } = require('../middleware/auth')


const router = express.Router()

// GET requests
router.get('/users', auth, UserController.getUsers) // get users
router.get('/users/:_id', auth, UserController.getUserById) // get user by id

// POST requests
router.post('/users', UserController.createUser) // create user

// PUT requests
router.put('/users/:_id', auth, UserController.updateUserById) // update user by id
router.put('/users/:_id/ban', auth, UserController.banUser)
router.put('/users/:_id/unban', auth, UserController.unbanUser)

// DELETE requests
router.put('/users/:_id', auth, UserController.deleteUserById)

module.exports = router
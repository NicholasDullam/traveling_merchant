const express = require('express')

const UserController = require('../controllers/userController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/user', UserController.createUser)
router.get('/user', auth, UserController.getUsers)
router.post('/changeEmail', auth, UserController.setEmail)
router.post('/changeFirst', auth, UserController.setFirst)
router.post('/changeLast', auth, UserController.setLast)
router.post('/changePassword', auth, UserController.setPassword)

module.exports = router
const express = require('express')

const ViewController = require('../controllers/viewController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

router.post('/views', getUserFromToken, ViewController.createView)
router.get('/views', getUserFromToken, ViewController.getViews)
router.get('/views/:_id', getUserFromToken, ViewController.getViewById)
router.delete('/views/:_id', getUserFromToken, ViewController.deleteViewById)

module.exports = router
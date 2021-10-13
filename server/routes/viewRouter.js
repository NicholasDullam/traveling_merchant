const express = require('express')

const ViewController = require('../controllers/viewController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/views', auth, ViewController.createView)
router.get('/views', auth, ViewController.getUserViews)
router.get('/views/:_id', auth, ViewController.getViewById)
router.delete('/views/:_id', auth, ViewController.deleteViewById)

module.exports = router
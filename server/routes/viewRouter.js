const express = require('express')

const ViewController = require('../controllers/viewController')

const router = express.Router()

router.post('/views', ViewController.createView)
router.get('/views', ViewController.getViews)

module.exports = router
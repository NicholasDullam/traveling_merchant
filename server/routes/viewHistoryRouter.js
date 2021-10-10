const express = require('express')

const viewController = require('../controllers/viewController')
const cookieController = require('../controllers/cookieController')

const router = express.Router()

router.post('/addView', cookieController.cookieController)
router.get('/userViewHistory', viewController.userViewHistory)

module.exports = router
const express = require('express')

const reviewController = require('../controllers/reviewController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/review', auth, reviewController.addReview)
router.get('/review', auth, reviewController.getReviews)

module.exports = router
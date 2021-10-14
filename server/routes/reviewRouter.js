const express = require('express')

const reviewController = require('../controllers/reviewController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/reviews', auth, reviewController.addReview)
router.get('/reviews', reviewController.getReviews)

module.exports = router
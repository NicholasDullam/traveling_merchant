const express = require('express')

const reviewController = require('../controllers/reviewController')

const { auth } = require('../middleware/auth')

const router = express.Router()


router.post('/reviews', auth, reviewController.addReview)
router.get('/reviews', reviewController.getReviews)
router.get('/reviews/:_id', reviewController.getReviewById)
router.put('/reviews/:_id', auth, reviewController.updateReviewById)
router.delete('/reviews/:_id', auth, reviewController.deleteReviewById)

module.exports = router
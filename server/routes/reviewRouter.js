const express = require('express')

const ReviewController = require('../controllers/reviewController')

const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()


router.post('/reviews', auth, ReviewController.addReview)
router.get('/reviews', ReviewController.getReviews)
router.get('/reviews/:_id', ReviewController.getReviewById)
router.post('/reviews/verify/:_id', adminAuth, ReviewController.verifyReviewById)
router.put('/reviews/:_id', adminAuth, ReviewController.updateReviewById)
router.delete('/reviews/:_id', adminAuth, ReviewController.deleteReviewById)
router.get('/reviews/rating/:_id', ReviewController.getReviewRating)

module.exports = router
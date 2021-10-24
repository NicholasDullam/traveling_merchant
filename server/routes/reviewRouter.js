const express = require('express')

const reviewController = require('../controllers/reviewController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()


router.post('/reviews', auth, isBanned, reviewController.addReview)
router.get('/reviews', isBanned, reviewController.getReviews)
router.get('/reviews/:_id', isBanned, reviewController.getReviewById)
router.put('/reviews/:_id', auth, isBanned, reviewController.updateReviewById)
router.delete('/reviews/:_id', auth, isBanned, reviewController.deleteReviewById)

module.exports = router
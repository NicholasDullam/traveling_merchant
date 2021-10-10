const express = require('express')

const followerController = require('../controllers/followerController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/follower', auth, followerController.addFollower)
router.get('/follower', auth, followerController.getFollowers)
router.get('/userfollower', auth, followerController.getUserFollowers)

module.exports = router
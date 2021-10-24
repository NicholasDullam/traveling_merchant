const express = require('express')

const FollowerController = require('../controllers/followerController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

router.post('/followers', auth, isBanned, FollowerController.createFollower)
router.get('/followers', auth, isBanned, FollowerController.getFollowers)
router.get('/followers/:_id', auth, isBanned, FollowerController.getFollowerById)
router.delete('/followers/:_id', auth, isBanned, FollowerController.deleteFollowerById)

module.exports = router
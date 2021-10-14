const express = require('express')

const FollowerController = require('../controllers/followerController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/followers', auth, FollowerController.createFollower)
router.get('/followers', auth, FollowerController.getFollowers)
router.get('/followers/:_id', auth, FollowerController.getFollowerById)
router.delete('/followers/:_id', auth, FollowerController.deleteFollowerById)

module.exports = router
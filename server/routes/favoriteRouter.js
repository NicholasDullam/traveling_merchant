const express = require('express')

const favoriteController = require('../controllers/favoriteController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/favorite', auth, favoriteController.addfavorite)
router.get('/favorite', auth, favoriteController.getFavorites)
router.get('/userfavorite', auth, favoriteController.getUserFavorites)

module.exports = router
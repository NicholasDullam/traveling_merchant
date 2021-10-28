const express = require('express')

const FavoriteController = require('../controllers/favoriteController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/favorites', auth, FavoriteController.createFavorite)
router.get('/favorites', auth, FavoriteController.getFavorites)
router.get('/favorites/:_id', auth, FavoriteController.getFavoriteById)
router.delete('/favorites/:_id', auth, FavoriteController.deleteFavoriteById)

module.exports = router
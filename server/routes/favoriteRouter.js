const express = require('express')

const FavoriteController = require('../controllers/favoriteController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

router.post('/favorites', auth, isBanned, FavoriteController.createFavorite)
router.get('/favorites', auth, isBanned, FavoriteController.getFavorites)
router.get('/favorites/:_id', auth, isBanned, FavoriteController.getFavoriteById)
router.delete('/favorites/:_id', auth, isBanned, FavoriteController.deleteFavoriteById)

module.exports = router
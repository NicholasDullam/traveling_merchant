const express = require('express')

const GameController = require('../controllers/gameController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/games', isBanned, GameController.getGames) // get games
router.get('/games/:_id', isBanned, GameController.getGameById) // get game by id

// POST requests
router.post('/games', auth, isBanned, GameController.createGame) // create game

// PUT requests
router.put('/games/:_id', auth, isBanned, GameController.updateGameById) // update game by id

// DELETE requests
router.delete('/games/:_id', auth, isBanned, GameController.deleteGameById) // update game by id

module.exports = router
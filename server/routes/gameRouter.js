const express = require('express')

const GameController = require('../controllers/gameController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/games', GameController.getGames) // get games
router.get('/games/:_id', GameController.getGameById) // get game by id

// POST requests
router.post('/games', auth, GameController.createGame) // create game

// PUT requests
router.put('/games/:_id', auth, GameController.updateGameById) // update game by id

// DELETE requests
router.delete('/games/:_id', auth, GameController.deleteGameById) // update game by id

module.exports = router
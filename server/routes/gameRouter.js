const express = require('express')

const GameController = require('../controllers/gameController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/game', GameController.createGame)
router.get('/game', GameController.getGames)

module.exports = router
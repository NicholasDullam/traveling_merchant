const express = require('express')

const { auth } = require('../middleware')

const router = express.Router()

router.post('/game', auth, (req, res) => {

})

module.exports = router
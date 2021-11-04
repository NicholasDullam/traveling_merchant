const express = require('express')

const FilterController = require('../controllers/filterController')

const { adminAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/filters', adminAuth, FilterController.createFilter)
router.get('/filters', adminAuth, FilterController.getFilters)
router.delete('/filters/:_id', adminAuth, FilterController.deleteFilterById)

module.exports = router
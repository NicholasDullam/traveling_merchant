const express = require('express')

const ProductController = require('../controllers/productController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/product', auth, ProductController.createProduct)

module.exports = router
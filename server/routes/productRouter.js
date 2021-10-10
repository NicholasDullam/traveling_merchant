const express = require('express')

const ProductController = require('../controllers/productController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/products', auth, ProductController.getProducts)

// POST requests
router.post('/products', auth, ProductController.createProduct) // create product

module.exports = router
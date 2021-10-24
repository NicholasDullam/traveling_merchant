const express = require('express')

const ProductController = require('../controllers/productController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/products', isBanned, ProductController.getProducts)
router.get('/products/:_id', isBanned, ProductController.getProductById)

// POST requests
router.post('/products', auth, isBanned, ProductController.createProduct) // create product

// PUT requests
router.put('/products/:_id', auth, isBanned, ProductController.updateProductById)

// DELETE requests
router.delete('/products/:_id', auth, isBanned, ProductController.deleteProductById)

module.exports = router
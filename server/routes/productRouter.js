const express = require('express')

const ProductController = require('../controllers/productController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/products/recommended', auth, ProductController.getRecommended)
router.get('/products', ProductController.getProducts)
router.get('/products/:_id', ProductController.getProductById)
router.get('/products/:_id/similar', ProductController.getSimilar)

// POST requests
router.post('/products', auth, ProductController.createProduct)

// PUT requests
router.put('/products/:_id', auth, ProductController.updateProductById)

// DELETE requests
router.delete('/products/:_id', auth, ProductController.deleteProductById)

module.exports = router
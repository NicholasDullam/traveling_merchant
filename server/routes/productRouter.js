const express = require('express')

const ProductController = require('../controllers/productController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/products', auth, ProductController.createProduct) // create product
router.get('/product', auth, ProductController.getProducts)

module.exports = router
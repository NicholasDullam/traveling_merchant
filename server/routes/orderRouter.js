const express = require('express')

const OrderController = require('../controllers/orderController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/order', auth, OrderController.createOrder)
router.post('/order/deliver', auth, OrderController.deliverOrder)
router.post('/order/confirm', auth, OrderController.confirmDelivery)
router.post('/order/deny', auth, OrderController.denyDelivery)
router.post('/order/cancel', auth, OrderController.cancelOrder)
router.get('/order', auth, OrderController.getOrders)
router.get('/userOrders', auth, OrderController.getUserOrders)

module.exports = router
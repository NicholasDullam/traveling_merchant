const express = require('express')

const OrderController = require('../controllers/orderController')

const { auth } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/orders', auth, OrderController.getOrders) // get orders
router.get('/orders/:_id', auth, OrderController.getOrderById) // get order by id

// POST requests
router.post('/orders', auth, OrderController.createOrder) // create order

// PUT requests
router.put('/orders/:_id/deliver', auth, OrderController.deliverOrder) // mark order as delivered
router.put('/orders/:_id/confirm', auth, OrderController.confirmDelivery) // confirm order delivery
router.put('/orders/:_id/deny', auth, OrderController.denyDelivery) // deny order deliver
router.put('/orders/:_id/cancel', auth, OrderController.cancelOrder) // cancel order

module.exports = router
const express = require('express')

const OrderController = require('../controllers/orderController')

const { auth, isBanned } = require('../middleware/auth')

const router = express.Router()

// GET requests
router.get('/orders', auth, isBanned, OrderController.getOrders) // get orders
router.get('/orders/:_id', auth, isBanned, OrderController.getOrderById) // get order by id

// POST requests
router.post('/orders', auth, isBanned, OrderController.createOrder) // create order

// PUT requests
router.put('/orders/:_id/deliver', auth, isBanned, OrderController.deliverOrder) // mark order as delivered
router.put('/orders/:_id/confirm', auth, isBanned, OrderController.confirmDelivery) // confirm order delivery
router.put('/orders/:_id/deny', auth, isBanned, OrderController.denyDelivery) // deny order deliver
router.put('/orders/:_id/cancel', auth, isBanned, OrderController.cancelOrder) // cancel order

module.exports = router
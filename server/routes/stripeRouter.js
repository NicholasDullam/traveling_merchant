const express = require('express')

const StripeController = require('../controllers/stripeController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/stripe/payment-intents', auth, StripeController.createPaymentIntentFromOrder)
router.post('/stripe/account', auth, StripeController.createAccount)
router.get('/stripe/account/onboarding', auth, StripeController.getAccountOnboarding)

module.exports = router
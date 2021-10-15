const express = require('express')

const StripeController = require('../controllers/stripeController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/stripe/accounts', auth, StripeController.createAccount)
router.get('/stripe/accounts/:acct_id/onboarding', auth, StripeController.getAccountOnboarding)
router.get('/stripe/payment-intents/:pi_id/secret', auth, StripeController.getClientSecret)
router.get('/stripe/customers/:customer_id/payment-methods', auth, StripeController.getPaymentMethods)

module.exports = router
const express = require('express')

const StripeController = require('../controllers/stripeController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/stripe/accounts', auth, StripeController.createAccount)
router.get('/stripe/accounts/onboarding', auth, StripeController.getAccountOnboarding)
router.get('/stripe/payment-requests/:pr_id/secret', auth, StripeController.getClientSecret)

module.exports = router
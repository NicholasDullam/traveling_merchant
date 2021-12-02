const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const stripe = require('stripe')(process.env.STRIPE_SECRET)

// connects to the stripe customer, paymentIntent, transfer, and account API
// all requests are limited to a response size of 1; ensuring consistent results
const verify = async () => {
    let customers = [], paymentIntents = [], transfers = [], accounts = []

    console.clear()

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await stripe.customers.list({ limit: 1 })
        customers.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying customer runtime: ${i + 1}/${125} | ${Math.round((i + 1)/125 * 100)}%`)
    }
    
    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await stripe.paymentIntents.list({ limit: 1 })
        paymentIntents.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying payment intent runtime: ${i + 1}/${125} | ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await stripe.transfers.list({ limit: 1 })
        transfers.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying transfer runtime: ${i + 1}/${125} | ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await stripe.accounts.list({ limit: 1 })
        accounts.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying account runtime: ${i + 1}/${125} | ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    let customerAverage = customers.reduce((value, append) => {
        return value + append
    }, 0) / customers.length

    let paymentIntentAverage = paymentIntents.reduce((value, append) => {
        return value + append
    }, 0) / paymentIntents.length

    let transferAverage = transfers.reduce((value, append) => {
        return value + append
    }, 0) / transfers.length

    let accountAverage = accounts.reduce((value, append) => {
        return value + append
    }, 0) / accounts.length

    let average = (customerAverage + paymentIntentAverage + transferAverage + accountAverage) / 4

    console.log('-----------------------------')
    console.log(`Customer average runtime: ${customerAverage}ms`)
    console.log(`Payment Intent average runtime: ${paymentIntentAverage}ms`)
    console.log(`Transfer average runtime: ${transferAverage}ms`)
    console.log(`Account average runtime: ${accountAverage}ms`)
    console.log('-----------------------------')
    console.log('\x1b[36m%s\x1b[0m', `Overall average runtime: ${average}ms\n`)
}

verify()
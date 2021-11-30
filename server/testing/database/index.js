const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const db = require('../../db')

db.on('error', console.error.bind(console, 'MongoDB Connection Error:'))

const Product = require('../../models/product')
const Order = require('../../models/order')
const Game = require('../../models/game')
const User = require('../../models/user')

// connects to the product, order, game, and user collections
// all requests are limited to a response size of 1; ensuring consistent results
const verify = async () => {
    let products = [], orders = [], games = [], users = []

    console.clear()

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await Product.find({}, { limit: 1 })
        products.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying product runtime: ${Math.round((i + 1)/125 * 100)}%`)
    }
    
    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await Order.find({}, { limit: 1 })
        orders.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying order runtime: ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await Game.find({}, { limit: 1 })
        games.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying game runtime: ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    for (i = 0; i < 125; i++) {
        let start = Date.now()
        await User.find({}, { limit: 1 })
        users.push(Date.now() - start)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Verifying user runtime: ${Math.round((i + 1)/125 * 100)}%`)
    }

    process.stdout.write('\n')

    let productAverage = products.reduce((value, append) => {
        return value + append
    }, 0) / products.length

    let orderAverage = orders.reduce((value, append) => {
        return value + append
    }, 0) / orders.length

    let gameAverage = games.reduce((value, append) => {
        return value + append
    }, 0) / games.length

    let userAverage = users.reduce((value, append) => {
        return value + append
    }, 0) / users.length

    let average = (productAverage + orderAverage + gameAverage + userAverage) / 4

    console.log('-----------------------------')
    console.log(`Product average runtime: ${productAverage}ms`)
    console.log(`Order average runtime: ${orderAverage}ms`)
    console.log(`Game average runtime: ${gameAverage}ms`)
    console.log(`User average runtime: ${userAverage}ms`)
    console.log('-----------------------------')
    console.log('\x1b[36m%s\x1b[0m', `Overall average runtime: ${average}ms\n`)
}

verify().then((response) => {
    db.close()
}).catch((error) => {
    console.log(error)
    db.close()
})
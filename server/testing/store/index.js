const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const User = require('../../models/user')

const db = require('../../db')

db.on('error', console.error.bind(console, 'MongoDB Connection Error:'))

const verify = async () => {
    let ids = [], sampleInstance = [], iterations = 50000, samples = 5

    console.clear()

    for (let i = 0; i < iterations; i++) {
        let user = new User({ first: 'storage', last: 'test', email: `st${i}@${Date.now()}.com` })
        user = await user.save()
        ids.push(user._id.toString())
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Creating users: ${i + 1}/${iterations} | ${Math.round((i + 1)/iterations * 100)}%`)
    }

    process.stdout.write('\n')
    console.log('-----------------------------')
    sampleInstance = [...ids]

    for (let i = 0; i < samples; i++) {
        let index = Math.floor(Math.random() * (sampleInstance.length - 1)), user = await User.findById(sampleInstance[index])
        process.stdout.write(`${i + 1} - Sampling user ${sampleInstance[index].toString()}: `)
        console.log(user)
        sampleInstance.splice(index, 1)
    }

    console.log('-----------------------------')

    await User.deleteMany({ _id: { $in: ids }})

    console.log(`${ids.length} users deleted`)
}

verify().then((response) => {
    db.close()
}).catch((error) => {
    console.log(error)
    db.close()
})
const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const User = require('../../models/user')

const db = require('../../db')

db.on('error', console.error.bind(console, 'MongoDB Connection Error:'))

const verify = async () => {
    let ids = [], sampleInstance = [], iterations = 10000, batch = 100, samples = 5

    console.clear()

    process.stdout.write('Initializing creation')
    for (let i = 0; i < iterations / batch; i++) {
        let temp = []
        for (let j = 0; j < batch; j++) {
            temp.push({ first: 'storage', last: 'test', email: `st${i*j}@${Date.now()}.com` })
        }

        let users = await User.create(temp);
        let userIds = users.map((user) => user._id)
        ids = [...ids, ...userIds]

        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Creating users: ${ids.length}/${iterations} | ${Math.round(ids.length/iterations * 100)}%`)
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


    process.stdout.write('Initializing deletion')
    for (let i = 0; i < iterations / batch; i++) {
        let remove = ids.slice(batch * i, batch * (i + 1))
        await User.deleteMany({ _id: { $in: remove }})

        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`Deleting users: ${batch * (i + 1)}/${iterations} | ${Math.round(batch * (i + 1)/iterations * 100)}%`)
    }
}

verify().then((response) => {
    db.close()
}).catch((error) => {
    console.log(error)
    db.close()
})
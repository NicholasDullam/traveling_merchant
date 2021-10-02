const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).catch((error) => {
    console.log('Connection Error: ', error.message)
})

const db = mongoose.connection

module.exports = db


// env variables
require('dotenv').config();

// general imports
const express = require('express');
const crypto = require('crypto');

const db = require('./db')

// create an express app
const app = express()
const port = process.env.PORT || 8000

app.use(express.json({
  verify: (req, res, buf) => {
    var url = req.originalUrl
    if (url.startsWith('/api/stripe/webhooks')) {
      req.rawBody = buf.toString()
    }
  }
}))

// db error listener
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'))

// route imports
const userRouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter')

// generate routes
app.use('/api', userRouter)
app.use('/api', authRouter)

// start the server listening for requests
app.listen(port, () => console.log(`Server running on port ${port}`));
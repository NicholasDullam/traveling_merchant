// env variables
var dotenv = require('dotenv').config()
// general imports
const express = require('express');
const cookieParser = require('cookie-parser')
const sslRedirect = require('heroku-ssl-redirect');
const http = require("http");
const db = require('./db')
var cors = require('cors');

// create an express app
const app = express()
const port = process.env.PORT || 8000

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ORIGIN || '*' : 'http://localhost:3000' || '*',
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(cookieParser())

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
const gameRouter = require('./routes/gameRouter')
const productRouter = require('./routes/productRouter')
const orderRouter = require('./routes/orderRouter')
const stripeRouter = require('./routes/stripeRouter')
const favoriteRouter = require('./routes/favoriteRouter')
const followerRouter = require('./routes/followerRouter')
const reviewRouter = require('./routes/reviewRouter')
const viewRouter = require('./routes/viewRouter')
const socketRouter = require('./routes/socketRouter')
const loginRouter = require('./routes/loginRouter')
const messageRouter = require('./routes/messageRouter')
const notificationRouter = require('./routes/notificationRouter')
const filterRouter = require('./routes/filterRouter')

// generate routes
app.use('/api', userRouter)
app.use('/api', authRouter)
app.use('/api', gameRouter)
app.use('/api', productRouter)
app.use('/api', orderRouter)
app.use('/api', stripeRouter)
app.use('/api', favoriteRouter)
app.use('/api', followerRouter)
app.use('/api', reviewRouter)
app.use('/api', viewRouter)
app.use('/api', socketRouter)
app.use('/api', loginRouter)
app.use('/api', messageRouter)
app.use('/api', notificationRouter)
app.use('/api', filterRouter)

// attach non-api requests to client build; redirect non-ssl traffic
if (process.env.NODE_ENV === 'production') {
    app.use(sslRedirect.default());
    app.use(express.static('../client/build'));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
    });
}

// create http server with app, attach socket.io instance
let server = http.createServer(app)
let io = require('socket.io')(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? process.env.ORIGIN || '*' : 'http://localhost:3000' || '*',
        transports: ['websocket', 'polling'],
        methods: ['GET', 'POST'],
        credentials: true  
    },
    allowEIO3: true 
})

// add io functions to socket object
require('./socket')(io)

server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = io
// Secret env variables
const dotenv = require('dotenv');
dotenv.config();
var t = process.env.TOKEN_SECRET;
// mongoose set-up
const mongoose = require('mongoose');
// crypto set-up
var crypto = require('crypto');
// Database key
var db = process.env.DATABASE_SECRET;
// jwt
const jwt = require('jsonwebtoken');
// connect to database
mongoose.connect(db).catch(error => function(error) {
  console.log(error);
});

/* Models
 * User, Product, Order, Message, Review, Follower, Favorite, Notification
 */

var User = require('./models/usermodel');
var Product = require('./models/productmodel');
var Order = require('./models/ordermodel');
var Message = require('./models/messagemodel');
var Review = require('./models/reviewmodel');
var Follower = require('./models/followermodel');
var Favorite = require('./models/favoritemodel');
var Notification = require('./models/notificationmodel');
var ViewHistory = require('./models/viewhistorymodel')

// Token Creation function
function generateViewHistoryToken(email) {
  var token = crypto.randomBytes(128).toString;
  var f = 0;
  while (f == 0) {
    ViewHistory.findOne({token:token}).then(function(err, vh){
      if (!err) {
        token = crypto.randomBytes(128).toString;
      } else {
        f = 1;
      }
    });
  }
  var user;
  User.findOne({email:email}).then(function(err, u){
    if (err) {
      user = null;
    } else {
      user = u;
    }
  });
  var view = new ViewHistory();
  if (user) {
    view.user = user;
  }
  view.token = token;
  view.save().then(function(err) {
    if (err) {
      return "ERROR CREATING TOKEN";
    }
  });

  return jwt.sign({email:email,token:token}, t, { expiresIn: '30days'});
}

// Token Authentication, middle thing
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, t, function(err, user){
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

// create an express app
const express = require("express");
const { ObjectId } = require('bson');
const app = express()

app.use(express.json);

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.download('./html/index.html');
});

// create User Route
app.post('/createUser', function (req, res) {
  User.find({ email: req.email}, function (err, docs) {
    if (docs) {
      res.status(500).json({ error: "USER EXISTS WITH THAT EMAIL"});
    }
  });
  const u = new User();
  u.seller_id = req.seller_id;
  u.customer_id = req.customer_id;
  u.first = req.first;
  u.last = req.last;
  u.email = req.email;
  u.password = u.setPassword(req.password);
  u.profile_img = req.profile_img;
  u.settings = req.settings;
  u.created_at = new Date();
  u.updated_at = new Date();
  u.save().then(function(err) {
    if (err) {
      res.status(500).json({ error: "ERROR CREATING ACCOUNT"});
    } else {
      res.status(200).json({ error: "SUCCESS"});
    }
  })
});

// Login Route
app.post('/login', function (req, res) {
  User.findOne({ email: req.email}, function (err, doc) {
    if (err) {
      res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
    } else {
      if (doc.validPassword(req.password)) {
        res.status(200).json({error:"SUCCESS"})
      } else {
        res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
      }
    }
  })
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
  () => console.log("Server is running..."));
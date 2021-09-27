// Secret env variables
const dotenv = require('dotenv');
dotenv.config();
var t = process.env.TOKEN_SECRET;

// mongoose set-up
const mongoose = require('mongoose');

// crypto set-up
var crypto = require('crypto');

// Database key
var db = 'databaseKey';

// jwt
const jwt = require('jsonwebtoken');

// connect to database and add models
mongoose.connect(db);

/* Schemas
 * User, Product, Order, Message, Review, Follower, Favorite, Notification
 */

// User Schema

const userSchema = new mongoose.Schema({
  seller_id: String,
  customer_id: String,
  first: String,
  last: String,
  email: String,
  hash : String,
  salt : String,
  profile_img: String,
  settings: {
    // ...
  },
  created_at: Date,
  updated_at: Date
});

// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = function(password) { 
     
  // Creating a unique salt for a particular user 
     this.salt = crypto.randomBytes(16).toString('hex'); 
   
     // Hashing user's salt and password with 1000 iterations, 
      
     this.hash = crypto.pbkdf2Sync(password, this.salt,  
     1000, 64, `sha512`).toString(`hex`); 
 }; 
   
 // Method to check the entered password is correct or not 
 UserSchema.methods.validPassword = function(password) { 
     var hash = crypto.pbkdf2Sync(password,  
     this.salt, 1000, 64, `sha512`).toString(`hex`); 
     return this.hash === hash; 
 }; 

userSchema.methods.init = function () {};
const User = mongoose.model('User', userSchema);

// Product Schema

const productSchema = new mongoose.Schema({
  user_id: userSchema,
  name: String,
  type: String,
  delivery_type: String,
  description: String,
  media: [ String ],
  unit_price: Number,
  min_quantity: Number,
  stock: Number,
  private: Boolean,
  followers_only: Boolean,
  requirements: {
    //...
  },
  attributes: {
    //...
  },
  metadata: {
    //...
  },
  created_at: Date,
  updated_at: Date
});

// Method to add media
productSchema.methods.addMedia = function addMedia(v) {
  this.media[this.media.length] = v;
};

// Method to remove media
productSchema.methods.removeMedia = function removeMedia(v) {
  var i;
  for (i = 0; i < this.media.length; i++) {
    if (v = this.media[i]) {
      this.media[i] = null;
      break;
    }
  }
  if (i != this.media.length) {
    while (i != this.media.length - 1) {
      this.media[i] = this.media[i+1];
      i++;
    }
  }
};

productSchema.methods.init = function () {};
const Product = mongoose.model('Product', productSchema);

// Order Schema

const orderSchema = new mongoose.Schema({
  buyer: userSchema,
  seller: userSchema,
  status: String,
  custom: Boolean,
  delivered: Boolean,
  delivered_at: Date,
  total: Number,
  products: [{
    product_id: productSchema,
    quantity: Number
  }],
  requirements: {
    //...
  },
  metadata: {
    //...
  },
  created_at: Date,
  updated_at: Date
});

// Method to add product
orderSchema.methods.addProduct = function addProduct(p, n) {
  this.products[this.products.length] = {product_id:p,quantity:n};
};

// Method to remove product
orderSchema.methods.removeProduct = function removeProduct(v) {
  var i;
  for (i = 0; i < this.products.length; i++) {
    if (v = this.products[i]) {
      this.products[i] = null;
      break;
    }
  }
  if (i != this.products.length) {
    while (i != this.products.length - 1) {
      this.products[i] = this.products[i+1];
      i++;
    }
  }
};

// Method to mark as delivered
orderSchema.methods.markAsDelivered = function markAsDelivered() {
  this.delivered = true;
  this.delivered_at = new Date();
};

// Method to find Order with inputed buyer and seller
orderSchema.methods.findByBuyerSeller = function findByBuyerSeller(b, s) {
  return this.find({buyer:b, seller:s, delivered:true});
}

orderSchema.methods.init = function () {};
const Order = mongoose.model('Order', orderSchema);

// Message Schema

const messageSchema = new mongoose.Schema({
  to: userSchema,
  from: userSchema,
  content: String,
  attachments: [ String ],
  read: Boolean,
  read_at: Date,
  created_at: Date,
  updated_at: Date
});

// Method to mark as read
messageSchema.methods.markAsRead = function markAsRead() {
  this.read = true;
  this.read_at = new Date();
};

messageSchema.methods.init = function () {};
const Message = mongoose.model('Message', messageSchema);

// Review Schema

const reviewSchema = new mongoose.Schema({
  reviewer: userSchema,
  seller: userSchema,
  rating: Number,
  content: String,
  verfied: Boolean,
  created_at: Date,
  updated_at: Date
});

// method to verify purchase
reviewSchema.methods.verifyPurchase = function () {
  var order = Order.findByBuyerSeller(this.reviewer, this.seller);
  if (order) {
    this.verfied = true;
  } else {
    this.verfied = false;
  }
};

reviewSchema.methods.init = function () {};
const Review = mongoose.model('Review', reviewSchema);

// Follower Schema

const followerSchema = new mongoose.Schema({
  follower: userSchema,
  following: userSchema,
  created_at: Date
});

followerSchema.methods.init = function () {};
const Follower = mongoose.model('Follower', followerSchema);

// Favorite Schema

const favoriteSchema = new mongoose.Schema({
  user_id: userSchema,
  product_id: productSchema,
  created_at: Date
});

favoriteSchema.methods.init = function () {};
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Notification Schema

const notificationSchema = new mongoose.Schema({
  receiver: userSchema,
  sender: userSchema,
  content: String,
  seen: Boolean,
  seen_at: Date,
  created_at: Date
});

// Method to mark as seen
notificationSchema.methods.markAsSeen = function markAsSeen() {
  this.seen = true;
  this.seen_at = new Date();
}

notificationSchema.methods.init = function () {};
const Notification = mongoose.model('Notification', notificationSchema);

// Token Creation function
function generateToken(username) {
  return jwt.sign(username, t, { expiresIn: ''});
}

// Token Authentication
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

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
});

// create User Route
app.post('/createUser', function (req, res) {
  User.find({ email: req.email}, function (err, docs) {
    if (docs) {
      res.status(500).json({ error: "USER EXISTS WITH THAT EMAIL"});
    }
  });
  const u = new User;
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
  await u.save().then(function(err) {
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
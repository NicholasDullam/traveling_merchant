
// mongoose set-up
const mongoose = require('mongoose');

// create an express app
const express = require("express");
const { ObjectId } = require('bson');
const app = express()

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

/* Schemas
 * User, Product, Order, Message, Review, Follower, Favorite, Notification
 */

// User Schema

const userSchema = new mongoose.Schema({
  _id: ObjectId,
  seller_id: String,
  customer_id: String,
  first: String,
  last: String,
  email: String,
  password: String,
  profile_img: String,
  settings: {
    // ...
  },
  created_at: Date,
  updated_at: Date
});

userSchema.methods.init = function () {};

// Product Schema

const productSchema = new mongoose.Schema({
  _id: ObjectId,
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

productSchema.methods.addMedia = function addMedia(v) {
  this.media[this.media.length] = v;
};

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

const orderSchema = new mongoose.Schema({
  _id: ObjectId,
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

orderSchema.methods.addProduct = function addProduct(p, n) {
  this.products[this.products.length] = {product_id:p,quantity:n};
};

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

orderSchema.methods.markAsDelivered = function markAsDelivered() {
  this.delivered = true;
  this.delivered_at = new Date();
};

orderSchema.methods.findByBuyerSeller = function findByBuyerSeller(b, s) {
  return this.find({buyer:b, seller:s, delivered:true});
}

orderSchema.methods.init = function () {};

const messageSchema = new mongoose.Schema({
  _id: ObjectId,
  to: userSchema,
  from: userSchema,
  content: String,
  attachments: [ String ],
  read: Boolean,
  read_at: Date,
  created_at: Date,
  updated_at: Date
});

messageSchema.methods.markAsRead = function markAsRead() {
  this.read = true;
  this.read_at = new Date();
};

messageSchema.methods.init = function () {};

const reviewSchema = new mongoose.Schema({
  _id: ObjectId,
  reviewer: userSchema,
  seller: userSchema,
  rating: Number,
  content: String,
  verfied: Boolean,
  created_at: Date,
  updated_at: Date
});

reviewSchema.methods.verifyPurchase = function () {
  var order = orderSchema.findByBuyerSeller(this.reviewer, this.seller);
  if (order) {
    this.verfied = true;
  } else {
    this.verfied = false;
  }
};

reviewSchema.methods.init = function () {};

const followerSchema = new mongoose.Schema({
  _id: ObjectId,
  follower: userSchema,
  following: userSchema,
  created_at: Date
});

followerSchema.methods.init = function () {};

const favoriteSchema = new mongoose.Schema({
  _id: ObjectId,
  user_id: userSchema,
  product_id: productSchema,
  created_at: Date
});

favoriteSchema.methods.init = function () {};

const notificationSchema = new mongoose.Schema({
  _id: ObjectId,
  receiver: userSchema,
  sender: userSchema,
  content: String,
  seen: Boolean,
  seen_at: Date,
  created_at: Date
});

notificationSchema.methods.markAsSeen = function markAsSeen() {
  this.seen = true;
  this.seen_at = new Date();
}

notificationSchema.methods.init = function () {};

main().catch(err => console.log(err));

async function main() {

  await mongoose.connect('mongodb://localhost:27017/test');

  // start the server listening for requests
  app.listen(process.env.PORT || 3000, 
    () => console.log("Server is running..."));

}
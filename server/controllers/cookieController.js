const View = require("../models/view")
const Product = require("../models/product")

// assume request has product and user email
const cookieController = async (req, res) => {
    let { user_id, name, email } = req.body;
    const token = req.cookies.view_history;
    var p;
    Product.findOne({user_id:user_id,name:name}).then(function(pr){p=pr});
    if (!token) {
        token = generateViewToken(email);
        if (!token) {
            return req.status(404).json({error:"Could not create cookie"})
        } else {
            req.cookie("view_history", token)
            View.findOne({token:token.token}).then(function(err, vh){
                vh.addProduct(p)
            });
        }
    } else {
        View.findOne({token:token.token}).then(function(err, vh){
            vh.addProduct(p)
        });
    }
  }

  const generateViewToken = (email) => {
    var token = crypto.randomBytes(128).toString;
    var f = 0;
    while (f == 0) {
      View.findOne({token:token}).then(function(err, vh){
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
    var view = new View();
    if (user) {
      view.user = user;
    }
    view.token = token;
    view.save().then(function(s) {
      if (!s) {
        return null;
      } else {
        return {email:email,token:token};
      }
    });
  }

  const getCookies = async (req,res) => {
    return res.json(res.cookies).status(200);
  }
  
  module.exports = {
      cookieController,
      getCookies
  }
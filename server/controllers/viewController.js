const jwt = require('jsonwebtoken')
const View = require('../models/view')

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
    view.save().then(function(err) {
      if (err) {
        return "ERROR CREATING TOKEN";
      }
    });
  
    return jwt.sign({email:email,token:token}, t, { expiresIn: '30days'});
  }
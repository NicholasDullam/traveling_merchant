const View = require("../models/view")

const viewController = async (req, res) => {
    const token = req.cookies.view_history;
    if (!token) {
        View.findOne({email:req.email}).then(function(err, vh){
            return req.view_history = vh
        });
    } else {
        View.findOne({token:token.token}).then(function(err, vh){
            return req.view_history = vh
        });
    }
  }
  
  module.exports = {
      viewController
  }
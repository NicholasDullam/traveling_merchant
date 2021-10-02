const User = require('../models/user')

const createUser = async (req, res) => {
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
}

module.exports = {
    createUser
}
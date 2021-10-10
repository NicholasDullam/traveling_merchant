const favorite = require("../models/favorite");
const User = require("../models/user");

// Assume request has product and user's email
const addfavorite = async (req, res) => {
    const f = new favorite();
    f.product_id = req.body.p;
    User.findOne({email:req.body.email}, function(err,u){
        if (err) {
            return req.status(500).json({message:"Invalid User"});
        }
        f.user_id = u;
    })
    f.save().then(function(err) {
        if (err) {
          res.status(500).json({ error: "ERROR CREATING FAVORITE"});
        } else {
          res.status(200).json({ error: "SUCCESS"});
        }
      })
}

const getFavorites = (req, res) => {
  let query = { ...req.query }, reserved = ['sort', 'limit']
  reserved.forEach((el) => delete query[el])
  let queryPromise = favorite.find(query)

  if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
  if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

  queryPromise.then((response) => {
      return res.status(200).json(response)
  }).catch((error) => {
      return res.status(400).json({ error: error.message })
  })
}

const getUserFavorites = (req, res) => {
  const user = User.findById(req.user.id).exec();
  if (!user) return res.status(400).json({ error: 'Account not found'});

  favorite.find({user_id:user}).then((response) => {
      return res.status(200).json(response)
  }).catch((error) => {
      return res.status(400).json({ error: error.message })
  })
  
}

module.exports = {
    addfavorite,
    getFavorites,
    getUserFavorites
}
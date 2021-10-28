const Favorite = require("../models/favorite");
const User = require("../models/user");

// Assume request has product and user's email
const createFavorite = async (req, res) => {
    let { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: "Invalid input"})
    const favorite = new Favorite({ product_id, user_id: req.user.id });
    favorite.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getFavorites = (req, res) => {
  let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
  reserved.forEach((el) => delete query[el])
  let queryPromise = Favorite.find(query)

  if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
  if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
  if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

  queryPromise.then((response) => {
      return res.status(200).json(response)
  }).catch((error) => {
      return res.status(400).json({ error: error.message })
  })
}

const getFavoriteById = (req, res) => {
  let { _id } = req.params
  Favorite.findById(_id).then((response) => {
      return res.status(200).json(response)
  }).catch((error) => {
      return res.status(200).json({ error: error.message })
  })
}

const deleteFavoriteById = (req, res) => {
  let { _id } = req.params
  Favorite.findByIdAndDelete(_id).then((response) => {
      return res.status(200).json(response)
  }).catch((error) => {
      return res.status(400).json({ error: error.message })
  })
}

module.exports = {
    createFavorite,
    getFavorites,
    getFavoriteById,
    deleteFavoriteById
}
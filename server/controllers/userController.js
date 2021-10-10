const User = require('../models/user')
const bcrypt = require('bcrypt')

// assume req has seller_id, customer_id, first and last name, email, password, profile_img, and settings
const createUser = async (req, res) => {
    let { email, first, last, password } = req.body
    console.log(req.body + " " + email)
    let existing = await User.find({ email })
    if (existing.length) return res.status(500).json({ error: "USER EXISTS WITH THAT EMAIL"})
    const user = new User({ email, first, last })
      
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.save().then((response) => {
      return res.status(200).json(response)
    }).catch((error) => {
      return res.status(400).json({ error: error.message })
    })
}

const setEmail = async (req, res) => {
  const user = User.findById(req.user.id);
  if (!user) return res.status(400).json({ error: 'Account not found'});
  user.email = req.body.email;
  user.save().then((response) => {
    return res.status(200).json(response)
  }).catch((error) => {
    return res.status(400).json({ error: error.message })
  })
}

const setFirst = async (req, res) => {
  const user = User.findById(req.user.id);
  if (!user) return res.status(400).json({ error: 'Account not found'});
  user.first = req.body.first;
  user.save().then((response) => {
    return res.status(200).json(response)
  }).catch((error) => {
    return res.status(400).json({ error: error.message })
  })
}

const setLast = async (req, res) => {
  const user = User.findById(req.user.id);
  if (!user) return res.status(400).json({ error: 'Account not found'});
  user.last = req.body.last;
  user.save().then((response) => {
    return res.status(200).json(response)
  }).catch((error) => {
    return res.status(400).json({ error: error.message })
  })
}

const setPassword = async (req, res) => {
  let { password } = req.body
  const user = User.findById(req.user.id);
  if (!user) return res.status(400).json({ error: 'Account not found'});
  let salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  user.save().then((response) => {
    return res.status(200).json(response)
  }).catch((error) => {
    return res.status(400).json({ error: error.message })
  })
}

  const getUsers = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = User.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
  }


const getUserById = async (req, res) => {
    let { _id } = req.params
    User.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const updateUserById = async (req, res) => {
    let { _id } = req.params 
    User.findByIdAndUpdate(_id, req.body, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createUser,
    setFirst,
    setLast,
    setEmail,
    setPassword,
    getUsers,
    getUserById,
    updateUserById
}
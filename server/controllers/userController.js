const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createCustomer } = require('./stripeController')

// assume req has seller_id, customer_id, first and last name, email, password, admin status, profile_img, and settings
const createUser = async (req, res) => {
    let { email, first, last, password, admin } = req.body
    let existing = await User.find({ email })
    if (existing.length) return res.status(500).json({ error: "USER EXISTS WITH THAT EMAIL"})
    const user = new User({ email, first, last, admin })
      
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    let customer = await createCustomer(`${first} ${last}`, email)
    user.cust_id = customer.id

    user.save().then((response) => {
      token = jwt.sign({ id: response._id, acct_id: response.acct_id, cust_id: response.cust_id, admin: response.admin, banned: response.banned }, process.env.TOKEN_SECRET)
      return res.cookie('access_token', token, { httpOnly: true, secure:process.env.NODE_ENV === "production" }).status(200).json({ token, user: response })
    }).catch((error) => {
        console.log(error)
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

const deleteUserById = async (req, res) => {
    let { _id } = req.params
    User.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.staus(400).json({ error: error.message })
    })
}

const banUser = async (req, res) => {
    let { _id } = req.params
    if (!req.user.admin) return res.status(400).json({ error: 'Invalid permissions' })
    User.findByIdAndUpdate(_id, { banned: true }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const unbanUser = async (req, res) => {
    let { _id } = req.params
    if (!req.user.admin) return res.status(400).json({ error: 'Invalid permissions' })
    User.findByIdAndUpdate(_id, { banned: false }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    banUser,
    unbanUser
}
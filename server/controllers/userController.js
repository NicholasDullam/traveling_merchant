const User = require('../models/user')
const Login = require('../models/login')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { createCustomer } = require('./stripeController')

// assume req has seller_id, customer_id, first and last name, email, password, admin status, profile_img, and settings
const createUser = async (req, res) => {
    const log = await Login.findOne({ip:req.ip,banned:true});
    if (log != null) {
        return res.status(400).json({ error: 'IP is banned'})
    }

    let { email, first, last, password, admin } = req.body
    if (!email || !first || !last || !password) return res.status(400).json({ error: "Invalid input"})
    let existing = await User.find({ email })
    if (existing.length) return res.status(500).json({ error: "USER EXISTS WITH THAT EMAIL"})
    const user = new User({ email, first, last, admin })
      
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    let customer = await createCustomer(`${first} ${last}`, email)
    user.cust_id = customer.id

    user.save().then((response) => {
        var login = new Login({ id: response._id, admin: response.admin, banned: response.banned, ip: req.ip });
        login.save().then().catch((error) => {
            console.log(error)
            return res.status(400).json({ error: error.message })
        })
        token = jwt.sign({ id: response._id, acct_id: response.acct_id, cust_id: response.cust_id, admin: response.admin, banned: response.banned }, process.env.TOKEN_SECRET)
        return res.cookie('access_token', token, { httpOnly: true, secure:process.env.NODE_ENV === "production" }).status(200).json({ token, user: response })
    }).catch((error) => {
        console.log(error)
        return res.status(400).json({ error: error.message })
    })
}

const getUsers = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = User.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit) + 1)

    queryPromise.then((response) => {
        let results = { has_more: false, data: response }
        if (req.query.limit && response.length > Number(req.query.limit)) results = { has_more: true, data: response.slice(0, response.length - 1) }
        return res.status(200).json(results)    
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
    
    Login.find({id:_id}).then((docs) => {
        docs.forEach((el) => {
            el.banned = true
            el.save().then().catch((err) => {
                return res.status(400).json({error:err})
            })
        })
    }).catch((err) => {
        return res.status(400).json({error:err})
    })
    User.findByIdAndUpdate(_id, { banned: true }, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const unbanUser = async (req, res) => {
    let { _id } = req.params
    if (!req.user.admin) return res.status(400).json({ error: 'Invalid permissions' })
    
    Login.find({id:_id}).then((docs) => {
        docs.forEach((el) => {
            el.banned = false
            el.save().then().catch((err) => {
                return res.status(400).json({error:err})
            })
        })
    }).catch((err) => {
        return res.status(400).json({error:err})
    })
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
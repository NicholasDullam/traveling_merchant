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

const getSort = (sortString) => {
    let direction = 1
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
}

const getUsers = async (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit'], pipeline = []
    reserved.forEach((el) => delete query[el])

    pipeline.push({ $match: query })
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    
    // paginate pipeline facet
    pipeline.push({
        $facet: {
            data: function paginate () {
                let data = []
                if (req.query.skip) data.push({ $skip: Number(req.query.skip) })
                if (req.query.limit) data.push({ $limit: Number(req.query.limit) })
                return data
            } (),
            results: [{ $count: 'count' }]
        }
    })

    //paginate pipeline count removal
    pipeline.push({
        $project: {
            data: '$data',
            results: { $arrayElemAt: [ "$results", 0 ]}
        }
    })

    User.aggregate(pipeline).then((response) => {
        return res.status(200).json({ ...response[0], results: { count: response[0].results ? response[0].results.count : 0, has_more: (Number(req.query.skip) || 0) + (Number(req.query.limit) || 0) < (response[0].results ? response[0].results.count : 0) }})    
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
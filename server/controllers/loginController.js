const Login = require('../models/login')
const User = require('../models/user')

const banIp = (req, res) => {
    if (!req.user.admin) return res.status(400).json({error:"invalid permissions"})
    let { ip } = req.body
    if (!ip) {
        return res.status(400).json({error:"no ip specified"})
    }
    Login.find({ip:ip}).then((docs) => {
        docs.forEach((el) => {
            el.banned = true
            el.save().then().catch((err) => {
                return res.status(400).json({error:err})
            })
            User.findByIdAndUpdate(el.id, {banned : true}).then().catch((err) => {
                return res.status(400).json({error:err})
            })
        })
    }).catch((err) => {
        return res.status(400).json({error:err})
    })
    res.status(200)
}

const unbanIp = (req, res) => {
    if (!req.user.admin) return res.status(400).json({error:"invalid permissions"})
    let { ip } = req.body
    if (!ip) return res.status(400).json({error:"no ip specified"})

    Login.find({ip:ip}).then((docs) => {
        docs.forEach((el) => {
            el.banned = false
            el.save().then().catch((err) => {
                return res.status(400).json({error:err})
            })
            User.findByIdAndUpdate(el.id, {banned : false}).then().catch((err) => {
                return res.status(400).json({error:err})
            })
        })
    }).catch((err) => {
        return res.status(400).json({error:err})
    })
    res.status(200)
}

const unbanUserLogins = (req, res) => {
    if (!req.user.admin) return res.status(400).json({error:"invalid permissions"})
    let { user } = req.body
    if (!user) return res.status(400).json({error:"no user specified"})
    Login.find({id:user}).then((docs) => {
        docs.forEach((el) => {
            el.banned = false
            el.save().then().catch((err) => {
                return res.status(400).json({error:err})
            })
        })
    }).catch((err) => {
        return res.status(400).json({error:err})
    })
}

module.exports = {
    unbanIp,
    banIp,
    unbanUserLogins
}
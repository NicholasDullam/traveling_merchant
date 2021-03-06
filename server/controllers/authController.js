const jwt = require("jsonwebtoken")
const User = require('../models/user')
const Login = require('../models/login')
const bcrypt = require('bcrypt')
const token_secret = process.env.TOKEN_SECRET;

//assume req has email and password
const login = async (req, res) => {
    Login.findOne({ ip: req.ip, banned: true }).then((doc) => {
        if (doc != null) {
            return res.status(400).json({ error: 'IP is banned'})
        }
    })

    let { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: "Invalid input"})

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Account not found'})

    let valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        console.log("password incorrect")
        return res.status(400).json({ error: 'Password incorrect'})
    }
    
    var login = new Login({ user: user._id, admin: user.admin, banned: user.banned, ip: req.ip });

    login.save().then().catch((error) => {
        return res.status(400).json({ error: error.message })
    })
    
    const token = jwt.sign({ id: user._id, cust_id: user.cust_id, acct_id: user.acct_id, admin: user.admin, banned: user.banned, cookies: user.cookies }, token_secret)
    return res.cookie("access_token", token, { httpOnly: true, secure:process.env.NODE_ENV === "production" }).status(200).json({
        token,
        user
    })
}

const verifyToken = async (req, res) => {
    User.findById(req.user.id).then((response) => {
        return res.status(200).json({
            token: req.cookies.access_token,
            user: response
        })
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const logout = async (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" });
}

module.exports = {
    login,
    logout,
    verifyToken
}
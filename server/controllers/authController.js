const jwt = require("jsonwebtoken")
const User = require('../models/user')
const bcrypt = require('bcrypt')
const token_secret = process.env.TOKEN_SECRET;

//assume req has email and password
const login = async (req, res) => {
    let { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Account not found'})

    let valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        console.log("password incorrect")
        return res.status(400).json({ error: 'Password incorrect'})
    }
    
  const token = jwt.sign({ id: user._id, acct_id: user.acct_id, admin: user.admin, banned: user.banned }, token_secret)
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
    }
}

const logout = async (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" });
}

module.exports = {
    login,
    logout,
    verifyToken
}
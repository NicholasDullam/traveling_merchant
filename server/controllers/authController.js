const jwt = require("jsonwebtoken")
const User = require('../models/user')
const bcrypt = require('bcrypt')
const token_secret = process.env.TOKEN_SECRET;

const login = async (req, res) => {
    let { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Account not found'})

    let valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Password incorrect'})
    
    const token = jwt.sign({ email:req.email }, token_secret)
    return res.cookie("access_token", token, { httpOnly: true, secure:process.env.NODE_ENV === "production",}).status(200).json({ error: "SUCCESS" })
}

const logout = async (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" });
}

module.exports = {
    login,
    logout
}
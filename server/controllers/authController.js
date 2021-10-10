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
    if (!valid) return res.status(400).json({ error: 'Password incorrect'})
    
    const token = jwt.sign({ id: user._id, acct_id: user.acct_id, admin: user.admin, banned: user.banned || null }, token_secret)
    return res.cookie("access_token", token, { httpOnly: true, secure:process.env.NODE_ENV === "production" }).status(200).json({ error: "SUCCESS" })
}

const logout = async (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" });
}

const banUser = async (req, res) => {
    if (req.user.admin) {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(400).json({ error: 'Account not found'})
        user.banned = true;
        user.save().then((response) => {
          return res.status(200).json(response)
        }).catch((error) => {
          return res.status(400).json({ error: error.message })
        })
    }
}

const removeUser = async (req, res) => {
    if (req.user.admin) {
        User.findByIdAndDelete(user._id, function (err) {
            if(err) return res.status(400).json({ error: 'Account not found'});
            return res.status(200).json({ error: 'Account deleted'});
        });
    }
}

module.exports = {
    login,
    logout,
    banUser,
    removeUser
}
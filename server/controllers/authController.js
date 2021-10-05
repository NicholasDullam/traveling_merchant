const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_SECRET;

const login = async (req, res) => {
    User.findOne({ email: req.email }, function (err, doc) {
        if (err) {
            return res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
        } else {
            if (doc.validPassword(req.password)) {
                const token = jwt.sign({email:req.email}, token_secret);
                return res.cookie("access_token", token, {httpOnly:true,secure:process.env.NODE_ENV==="production",}).status(200).json({error:"SUCCESS"})
            } else {
                return res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
            }
        }
    })
}

module.exports = {
    login
}
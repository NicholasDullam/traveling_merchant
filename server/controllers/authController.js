const login = async (req, res) => {
    User.findOne({ email: req.email}, function (err, doc) {
        if (err) {
            res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
        } else {
            if (doc.validPassword(req.password)) {
                res.status(200).json({error:"SUCCESS"})
            } else {
                res.status(500).json({ error: "USERNAME OR PASSWORD IS INCORRECT"});
            }
        }
    })
}

module.exports = {
    login
}
const Ip = require('../models/ip');

const addBanned = (req, res) => {
    let {ip} = req.body;
    if (!req.user.admin) return res.status(400).json({error:'permission denied'});
    if (!ip) return res.status(400).json({error:'no IP specified'});
    Ip.findOne({ip:ip}).then((doc) => {
        if (doc) {
            return res.status(400).json({error:'Ip is already banned'});
        }
    }).catch();
    var newIp = new Ip(ip);
    newIp.save().then().catch((err) => {
        return res.status(400).json(err);
    });
}

const removeBanned = (req, res) => {
    let {ip} = req.body;
    if (!req.user.admin) return res.status(400).json({error:'permission denied'});
    if (!ip) return res.status(400).json({error:'no IP specified'});
    Ip.findOneAndDelete({ip:ip}).then().catch((err) => {
        return res.status(400).json(err);
    });
}

module.exports = {
    addBanned,
    removeBanned
}
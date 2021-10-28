const Ip = require('../models/ip');
const User = require('../models/user')
var ips = [];

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
    ips.push(ip);
    User.find({ips:ip}).then((users) => {
        users.forEach((el) => {
            el.banned = true;
            el.save().then().catch();
        })
    })
}

const removeBanned = (req, res) => {
    let {ip} = req.body;
    if (!req.user.admin) return res.status(400).json({error:'permission denied'});
    if (!ip) return res.status(400).json({error:'no IP specified'});
    Ip.findOneAndDelete({ip:ip}).then().catch((err) => {
        return res.status(400).json(err);
    });
    var i = ips.indexOf(ip);
    if (i != -1) {
        ips.splice(i, 1);
    }
    User.find({ips:ip}).then((users) => {
        users.forEach((el) => {
            el.banned = false;
            el.save().then().catch();
        })
    })
}

const init = (req, res) => {
    var i = 0;
    Ip.find().then((ip) => {
        ip.forEach((el) => {
            ips[i] = el.ip;
            i++;
        })
    })
}

module.exports = {
    addBanned,
    removeBanned,
    init,
    ips
}
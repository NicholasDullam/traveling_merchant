const jwt = require('jsonwebtoken')
const token_secret = process.env.TOKEN_SECRET;
const Ip = require('../models/ip');
const User = require('../models/user')

const isBanned = async (req, res, next) => {

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (req.user) {
    const user = await User.findById(req.user.id)
    if (user) {
      if (user.ips.indexOf(ip) == -1) {
        user.ips.push(ip);
        user.save().then().catch((err) => {
          console.log('beep boop:\n' + err);
        });
      }
      user.ips.forEach(ip => {
        Ip.findOne({ip:ip}).then((doc) => {
          if (doc) {
            return res.status(400).json({error:'Ip is banned'});
          }
        }).catch((err) => {
          console.log(err);
        });
      });
    } else {
      return res.status(400).json({error:'User not found in isBanned :?'});
    }
  } else {
    Ip.findOne({ip:ip}).then((doc) => {
        if (doc) {
            return res.status(400).json({error:'Ip is banned'});
        }
    }).catch((err) => {
        console.log("beep boop:\n")
        console.log(err)
    });
  }
  next()
}

const auth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(403);
  try {
    const data = jwt.verify(token, token_secret);
    req.user = data
    if (req.user.banned) return res.status(403).json({ error: 'You are banned' })
    return next()
  } catch {
    return res.sendStatus(403);
  }
}

const getUserFromToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) req.user = jwt.verify(token, token_secret)
  else req.user = {}
  next()
}

module.exports = {
  isBanned,
  auth,
  getUserFromToken
}
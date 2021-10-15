const jwt = require('jsonwebtoken')
const token_secret = process.env.TOKEN_SECRET;

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
    auth,
    getUserFromToken
}
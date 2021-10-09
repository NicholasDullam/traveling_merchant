const jwt = require('jsonwebtoken')
const token_secret = process.env.TOKEN_SECRET;

const auth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(403);
  try {
    const data = jwt.verify(token, token_secret);
    req.user = data
    return next()
  } catch {
    return res.sendStatus(403);
  }
}

module.exports = {
    auth
}
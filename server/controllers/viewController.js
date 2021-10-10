const View = require("../models/view")

// assume req has email
const userViewHistory = async (req, res) => {
    let { user } = req.body
    const token = req.cookies.view_history;
    if (!token) {
        View.findOne({email:user}).then(function(err, vh){
            return req.view_history = vh
        });
    } else {
        View.findOne({token:token.token}).then(function(err, vh){
            return req.view_history = vh
        });
    }
  }

const getViews = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = View.find(query)

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit))

    queryPromise.then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}
  
  module.exports = {
      userViewHistory,
      getViews
  }
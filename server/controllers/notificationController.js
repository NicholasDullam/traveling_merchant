const Notification = require('../models/notification')

const getNotifications = async (req, res) => {
    let query = { ...req.query, receiver: req.user.id }, reserved = ['sort', 'skip', 'limit']
    reserved.forEach((el) => delete query[el])
    let queryPromise = Notification.find({ ...query })

    if (req.query.sort) queryPromise = queryPromise.sort(req.query.sort)
    if (req.query.skip) queryPromise = queryPromise.skip(Number(req.query.skip))
    if (req.query.limit) queryPromise = queryPromise.limit(Number(req.query.limit) + 1)

    queryPromise.then((response) => {
        let results = { has_more: false, data: response }
        if (req.query.limit && response.length > Number(req.query.limit)) results = { has_more: true, data: response.slice(0, response.length - 1) }
        return res.status(200).json(results)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    getNotifications
}
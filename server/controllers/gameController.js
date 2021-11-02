const Game = require('../models/game')

const createGame = (req, res) => {
    let { name, developer, product_types, platforms, banner_img, img } = req.body
    if (!name || !developer || !product_types || !platforms || !img || !banner_img) return res.status(400).json({ error: "Invalid input"})
    let game = new Game({ name, developer, product_types, platforms, img, banner_img })
    game.save().then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getSort = (sortString) => {
    let direction = 1
    if (sortString.indexOf('-')) direction = -1
    return { [sortString.replace('-', '')]: direction }
}

const getGames = (req, res) => {
    let query = { ...req.query }, reserved = ['sort', 'skip', 'limit', 'q'], pipeline = []
    reserved.forEach((el) => delete query[el])

    if (req.query.q) pipeline.push({ $search: { index: 'gameSearch', text: { query: req.query.q, path: { wildcard: '*' }}}})
    pipeline.push({ $match: query })
    if (req.query.sort) pipeline.push({ $sort: getSort(req.query.sort) })
    if (req.query.skip) pipeline.push({ $skip: Number(req.query.skip) })
    if (req.query.limit) pipeline.push({ $limit: Number(req.query.limit) })

    console.log(pipeline)

    Game.aggregate(pipeline).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const getGameById = (req, res) => {
    let { _id } = req.params
    Game.findById(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const updateGameById = (req, res) => {
    let { _id } = req.params
    Game.findByIdAndUpdate(_id, req.body, { new: true }).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

const deleteGameById = (req, res) => {
    let { _id } = req.params
    Game.findByIdAndDelete(_id).then((response) => {
        return res.status(200).json(response)
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })
}

module.exports = {
    createGame,
    getGames,
    getGameById,
    updateGameById,
    deleteGameById
}
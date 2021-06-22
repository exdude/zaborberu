require('dotenv').config()
const qy = require('../controllers/sql/pool')
const location = require('./geo/index')
const getData = require('./data/index')
const TWENTY_FOUR = 60_000 * 60 * 24
module.exports = async (req, res, next) => {
    const cookies = req.cookies
    const currentCity = await location(req, res)
    const data = await getData(currentCity)
    if (!cookies.data || !cookies.date) {
        cookies.data = JSON.stringify(data)
        res.cookie('data', JSON.stringify(data))
        cookies.date = (new Date().getTime())
        res.cookie('date', (new Date().getTime()))
        qy(`INSERT INTO clients (ip, location, request) VALUES('${req.ip.replace(/::ffff:/, '')}', '${currentCity}', '${JSON.stringify(req.headers)}')`)
        next()
    } else {
        if (((new Date().getTime()) - Number(cookies.date)) >= TWENTY_FOUR) {
            cookies.data = JSON.stringify(data)
            res.cookie('data', JSON.stringify(data))
            cookies.date = (new Date().getTime())
            res.cookie('date', (new Date().getTime()))
        }
        next()
    }
    
}
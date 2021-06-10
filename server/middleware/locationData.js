require('dotenv').config()
const qy = require('../controllers/sql/pool')
const location = require('./geo/index')
const getData = require('./data/index')

module.exports = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies.data) {
        const currentCity = await location(req, res)
        const data = await getData(currentCity)
        cookies.data = JSON.stringify(data)
        res.cookie('data', JSON.stringify(data))
        qy(`INSERT INTO clients (ip, location, request) VALUES('${req.ip.replace(/::ffff:/, '')}', '${currentCity}', '${JSON.stringify(req.headers)}')`)
        next()
    } else {
        next()
    }
    
}
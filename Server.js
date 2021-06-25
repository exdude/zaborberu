require('dotenv').config()

const config = require('./server/config')
const router = require('./server/router/index')
const httpsRedirect = require('./server/middleware/redirect/index')
const domianRedirect = require('./server/middleware/domianRedirect/index')
const app = require('express')()
const http = require('./https')

async function start(express, locationData, cookieParser) {
    try {
        if (process.env.PRODUCT === "true") app.use('/', httpsRedirect())

        app.set('views', './server/views')
        app.set('view engine', 'pug')
        app.use(cookieParser(process.env.COOKIE_SECRET))
        app.use(locationData)
        app.use(domianRedirect)
        app.use(express.static('./public'))
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(router)
        app.use((req, res, next) => res.status(404).render('404'))



        if (process.env.PRODUCT === "true") http(app).listen(process.env.S_PORT, config.HOST,  () => console.log(`Https Server listening on port ${config.HOST}:${process.env.S_PORT}`))
        app.listen(config.PORT, config.HOST,  () => console.log(`Server listening on port ${config.HOST}:${config.PORT}`))

    } catch (err) {
        console.log(`Server stoped with error: ${err}`)
    }
}

module.exports = start
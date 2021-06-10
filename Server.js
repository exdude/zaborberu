require('dotenv').config()
const router = require('./server/router/index')
const httpsRedirect = require('./server/middleware/redirect/index')
const domianRedirect = require('./server/middleware/domianRedirect/index')
const app = require('express')()
const http = require('./https')

async function start(express, locationData, cookieParser) {
    app.use('/', httpsRedirect())
    app.set('views', './server/views')
    app.set('view engine', 'pug')
    app.use(cookieParser(process.env.COOKIE_SECRET))
    app.use(locationData)
    app.use(domianRedirect)
    app.use(express.static('./public'))
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(router)
    app.use((req, res, next) => res.status(404).render('404'))
    
    try {
        http(app).listen(process.env.HS_PORT, process.env.HOST,  () => console.log(`Server listening on port ${process.env.HOST}:${process.env.HS_PORT}`))
        app.listen(process.env.H_PORT, process.env.HOST,  () => console.log(`Server listening on port ${process.env.HOST}:${process.env.H_PORT}`))
        app.listen(process.env.L_PORT, process.env.HOST, () => console.log(`Server listening on port ${process.env.HOST}:${process.env.L_PORT}`))
    } catch (err) {
        console.log(`Server stoped with error: ${err}`)
    }
}

module.exports = start
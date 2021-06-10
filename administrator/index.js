const Core = require('./core/index')
const router = require('./router/index')
const express = require('express')
const app = express()

const server = new Core({
    express: express,
    router: router,
    app: app
})

server.init()
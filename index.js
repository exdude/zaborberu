const { express, locationData, cookieParser } = require('./server/config/index')
const start = require('./Server')

start(express, locationData, cookieParser)
const start = require('./Server')
const { 
    express, 
    locationData, 
    cookieParser 
} = require('./server/config/index').server
start(express, locationData, cookieParser)
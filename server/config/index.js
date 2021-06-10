module.exports = {
    express: require('express'),
    app: require('express')(),
    router: require('express').Router(),
    cookieParser: require('cookie-parser'),
    locationData: require('../middleware/locationData')
}
require('dotenv').config()

module.exports = {
    "HOST": process.env.HOST || 'localhost',
    "PORT": process.env.PRODUCT === "true" ? process.env.PORT : 3000,
    "server": {
        "express": require('express'),
        "app": require('express')(),
        "router": require('express').Router(),
        "cookieParser": require('cookie-parser'),
        "locationData": require('../middleware/locationData')
    }
}
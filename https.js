module.exports = (app) => {
    const http = require('https')
    const fs = require('fs')
    let key = fs.readFileSync(__dirname + '/server/ssl/privkey.pem')
    let cert = fs.readFileSync(__dirname + '/server/ssl/cert.pem')
    let options = { key: key, cert: cert }
    return http.createServer(options, app)
}
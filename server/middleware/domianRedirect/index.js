const rtl = require('../rtl')
module.exports = (req, res, next) => {
    const data = JSON.parse(req.cookies.data)
    if (req.get('host').split('.').length >= 3) {
        next()
    } else {
        const city = rtl(data.name).toLowerCase()
        res.redirect(`https://${city}.${req.hostname}${req.originalUrl}`);
    }
}
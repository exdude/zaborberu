module.exports = (req) => {
    let query = () => {
        let arr = []
        if (req.query) {
            for (let key in req.query) {
                arr.push(`${key}=${req.query[key]}`)
            }
        }
        let result = arr.length > 1 ? arr.join('&') : arr.join('')
        return result
    }
    res.redirect(`http://${rtl(city).toLowerCase()}.${req.get('host')}/?${query()}`)
}
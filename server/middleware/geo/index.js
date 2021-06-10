require('dotenv').config()
const rtl = require('../rtl')
const fetch = require('node-fetch')

module.exports = async (req, res) => {
    if (req.get('host').split('.').length >= 3) {
        return req.get('host').split('.')[0]
    } else {
        const client = req.ip.replace(/::ffff:/, '')
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip="
        const token = process.env.DADATA_TOKEN
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            }
        }
        const result = await fetch(url + client, options)
        .then(response => response.text())
        .then(result => new Object({"ip": client, "data": result}))
        .catch(error => console.log("Ошибка геолокации: ", error))
        const location = result.data
        const currentLoc = JSON.parse(location)
        const city = currentLoc.location ? currentLoc.location.data.city : process.env.DEFAULT_CITY
        return city 
    }
    
}
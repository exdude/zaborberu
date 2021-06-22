require('dotenv').config()
const fetch = require('node-fetch')
const rtl = require('../rtl')

module.exports = async (x) => {
    try {
        let result = []
        const cities = await fetch(process.env.FETCH_URL_CITY).then(s => s.json())
        cities.forEach(d => {
            if (rtl(d.name).toLowerCase() === rtl(x).toLowerCase()) result.push(d)
        })
        return result[0]
    } catch (err) {
        console.log(`Ошибка в получения данных геолакации ${x}`);
    }
}
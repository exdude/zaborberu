require('dotenv').config()
const qy = require('../sql/pool')
const f = require('node-fetch')
module.exports = async function (req, res) {
    const data = JSON.parse(req.cookies.data)
    const mainData = {
        assorty_eu: (await qy('SELECT * FROM `assorty_eu`'))[0],
        assorty: (await qy('SELECT * FROM `assorty`'))[0],
        projects: (await qy('SELECT * FROM `projects`'))[0],
        projects_eu: (await qy('SELECT * FROM `projects_eu`'))[0],
        faq: (await qy('SELECT * FROM `faq`'))[0],
        city: data.name,
        count: data.s75,
        count_eu: data.sEu
    }
    return {
        index: {
            title: 'Продажа металлического штакетника с доставкой по всей России и странам Таможенного Союза',
            action: (await qy('SELECT * FROM `action`'))[0][0],
            data: mainData,
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            isSht: true
        },
        eu: {
            title: 'Продажа Еврожалюзи "Royal" с доставкой по всей России и странам Таможенного Союза',
            data: mainData,
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            isEu: true
        },
        about: {
            title: 'О компании',
            about: (await qy('SELECT * FROM `about`'))[0][0],
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            isAbout: true
        },
        thanks: {
            title: 'Спасибо за ваш отклик ' + req.query.name + '!',
            about: (await qy('SELECT * FROM `about`'))[0][0],
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            name: req.query.name,
            isThanks: true
        },
        pay: {
            title: 'Оплатить товар картой или QR кодом',
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            isPay: true
        },
        payment: {
            title: 'Оплатить товар картой или QR кодом',
            messengers: (await qy('SELECT * FROM `about`'))[0][0].messengers,
            isPay: true,
            payment: true
        }
    }
}
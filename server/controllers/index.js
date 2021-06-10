const opt = require('./options/index')
const SberBank = require('../sberbank/index')

class Controllers {

    async index(req, res, next) {
        res.render('index', (await opt(req, res)).index)
    }
    async eu(req, res, next) {
        res.render('index', (await opt(req, res)).eu)
    }

    async thanks(req, res, next) {
        res.render('thanks', (await opt(req, res)).thanks)
    }

    bitrix(req, res) {
        const b = require('./bitrix/index')
        const d = req.body
        new b({
            title: d.title,
            name: d.name,
            phone: d.phone,
            delivery: d.delivery,
            city: d.city,
            messenger: d.messenger
        }).send()
        res.redirect('/thanks?name=' + d.name)
    }

    async about(req, res) {
        res.render('about', (await opt(req, res)).about)
    }

    async pay(req, res) {
        if (req.query.pay) {
            res.render('pay', (await opt(req, res)).payment)
        } else {
            res.render('pay', (await opt(req, res)).pay)
        }
        
    }

    async payIt(req, res) {
        const sberbank = new SberBank(req.body)
        res.json(await sberbank.init())
    }
}

module.exports = Controllers
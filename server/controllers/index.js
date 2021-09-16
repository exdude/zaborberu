const opt = require('./options/index')
const SberBank = require('../sberbank/index')
const db = require('../model/index')
const offices = db.points

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
    async errors(req, res, next) {
        res.render('error', (await opt(req, res)).errors)
    }

    bitrix(req, res) {
        const d = req.body
        const bitrix = require('./bitrix/index')
        
        const lead = new bitrix({
            title: d.title,
            name: d.name,
            phone: d.phone,
            messenger: d.messenger,
            delivery: d.delivery,
            colors: d.colors,
            material: d.material,
            code_color: d.code_color,
            width: d.width,
            city: d.city
        })

        lead.send()
        
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
    async map(req, res) {
        res.json(await offices.findAll().then(result => result))
    }
    async colors(req, res) {
        res.json(require('../store/colors'))
    }
}

module.exports = Controllers
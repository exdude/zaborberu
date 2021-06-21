const router = require('express').Router()
const Controllers = require('../controllers/index')
const con = new Controllers()

router.get('/', con.index)
router.get('/eu', con.eu)
router.get('/thanks', con.thanks)
router.get('/about', con.about)
router.get('/pay', con.pay)
router.get('/map', con.map)
router.post('/pay', con.payIt)
router.post('/bitrix', con.bitrix)

module.exports = router
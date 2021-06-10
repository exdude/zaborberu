const rout = require('express').Router()
const Controllers = require('../controller/index')
const controller = new Controllers()

rout.get('/', controller.index)
rout.get('/assorty', controller.assorty)
rout.get('/assortyeu', controller.assortyeu)
rout.get('/projects', controller.projects)
rout.get('/projectseu', controller.projectseu)
rout.get('/faq', controller.faq)
rout.get('/error', controller.error)
rout.post('/api', controller.api)

module.exports = rout
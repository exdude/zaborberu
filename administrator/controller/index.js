const db = require('../db/index')
const Assorty = db.assorty
const AssortyEu = db.assortyeu
const Projects = db.Projects
const ProjectsEu = db.ProjectsEu
const Faq = db.Faq
const Payments = db.Payments
const Offices = db.Offices

class Controllers {
    index(req, res, next) {
        res.render('index', {
            title: 'Панель администратора',
            index: true
        })
    }
    async assorty(req, res, next) {
        res.render('assorty', {
            title: 'Панель администратора ассорти',
            data: await Assorty.findAll().then(result => result),
            assorty: true
        })
    }
    async assortyeu(req, res, next) {
        res.render('assortyeu', {
            title: 'Панель администратора ассорти еврожалюзи',
            data: await AssortyEu.findAll().then(result => result),
            assortyeu: true
        })
    }
    async projects(req, res, next) {
        res.render('projects', {
            title: 'Панель администратора проекты',
            data: await Projects.findAll().then(result => result),
            projects: true
        })
    }
    async projectseu(req, res, next) {
        res.render('projectseu', {
            title: 'Панель администратора проекты еврожалюзи',
            data: await ProjectsEu.findAll().then(result => result),
            projectseu: true
        })
    }
    async faq(req, res, next) {
        res.render('faq', {
            title: 'Панель администратора вопросы и ответы',
            data: await Faq.findAll().then(result => result),
            faq: true
        })
    }
    async payments(req, res, next) {
        res.render('payments', {
            title: 'Панель администратора оплата QR-code',
            data: await Payments.findAll().then(result => result),
            Payments: true
        })
    }
    async offices(req, res, next) {
        res.render('offices', {
            title: 'Панель администратора офисы',
            data: await Offices.findAll().then(result => result),
            Offices: true
        })
    }
    async error(req, res, next) {
        res.render('error', {
            title: 'Ошибка сервера'
        })
    }

    api(req, res, next) {
        console.log(req.body);
        switch(req.body.ltype) {
            case 'assorty':
                actions(req, res, Assorty)
                break
            case 'assortyeu':
                actions(req, res, AssortyEu)
                break
            case 'projects':
                actions(req, res, Projects)
                break
            case 'projectseu':
                actions(req, res, ProjectsEu)
                break
            case 'faq':
                actions(req, res, Faq)
                break
            case 'offices':
                actions(req, res, Offices)
                break
        }
    }
    async map(req, res, next) {
        res.json(await Offices.findAll().then(result => result))
    }
}

function actions(req, res, obj) {
    switch(req.body.action) {
        case 'create':
            obj.create(createForm(req.body, req))
            .then(result => {
                if (req.body.f) {
                    res.status(200)
                    res.send({
                        status: true,
                        result: result
                    })
                } else {
                    res.redirect(`/${req.body.ltype}`)
                }
            })
            .catch(err => {
                if (req.body.f) {
                    res.status(400)
                    res.send({
                        status: false,
                        result: err
                    })
                } else {
                    res.render('error', {
                        title: 'Ошибка! Не удалось создать элемент!',
                        error: err,
                        link: `/${req.body.ltype}`
                    })
                }
            })
            break
        case 'get':
            obj.findAll()
            .then(result => {
                if (req.body.f) {
                    res.status(200)
                    res.send({
                        status: true,
                        result: result
                    })
                } else {
                    res.redirect(`/${req.body.ltype}`)
                }
            })
            .catch(err => {
                if (req.body.f) {
                    res.status(400)
                    res.send({
                        status: false,
                        result: err
                    })
                } else {
                    res.render('error', {
                        title: 'Ошибка!',
                        error: err,
                        link: `/${req.body.ltype}`
                    })
                }
            })
            break
        case 'get_id':
            obj.findOne({where: {id: req.body.id}})
            .then(result => {
                if (req.body.f) {
                    res.status(200)
                    res.send({
                        status: true,
                        result: result
                    })
                } else {
                    res.redirect(`/${req.body.ltype}`)
                }
            })
            .catch(err => {
                if (req.body.f) {
                    res.status(400)
                    res.send({
                        status: false,
                        result: err
                    })
                } else {
                    res.render('error', {
                        title: 'Ошибка!',
                        error: err,
                        link: `/${req.body.ltype}`
                    })
                }
                
            })
            break
        case 'edit':
            obj.update(createForm(req.body, req), {where: {id: req.body.id}})
            .then(result => {
                if (req.body.f) {
                    res.status(200)
                    res.send({
                        status: true,
                        result: result
                    })
                } else {
                    res.redirect(`/${req.body.ltype}`)
                }
            })
            .catch(err => {
                if (req.body.f) {
                    res.status(400)
                    res.send({
                        status: false,
                        result: err
                    })
                } else {
                    res.render('error', {
                        title: 'Ошибка изменения',
                        error: err,
                        link: `/${req.body.ltype}`
                    })
                }
            })
            break
        case 'delete':
            obj.destroy({where: {id: req.body.id}})
            .then(result => {
                if (req.body.f) {
                    res.status(200)
                    res.send({
                        status: true,
                        result: result
                    })
                } else {
                    res.redirect(`/${req.body.ltype}`)
                }
            })
            .catch(err => {
                if (req.body.f) {
                    res.status(400)
                    res.send({
                        status: false,
                        result: err
                    })
                } else {
                    res.render('error', {
                        title: 'Ошибка удаления',
                        error: err,
                        link: `/${req.body.ltype}`
                    })
                }
            })
            break
    }
}

function createForm(obj, req) {
    if (req.files.scheme) req.body.scheme = req.files.scheme[0].filename
    if (req.files.img)  req.body.img = req.files.img[0].filename

    let n = {}
    for (let key in obj) {
        if (!(key === 'ltype' || key === 'action')) {
            n[key] = obj[key]
        }
    }
    return n
}

module.exports = Controllers
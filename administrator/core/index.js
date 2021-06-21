require('dotenv').config()
require('../module/ferma')


const PORT = process.env.PORT || 3000
const multer = require('../config/multer/index')





class Core {
    constructor(opt) {
        this.app = opt.app
        this.express = opt.express
        this.router = opt.router
    }
    init() {
        try {
            this.app.use(this.express.static(__dirname + '/../public'))
            this.app.use(this.express.json())
            this.app.use(this.express.urlencoded({extended: false}))
            this.app.use(multer)
            this.app.set('view engine', 'pug')
            this.app.use(this.router)
            this.app.use((req, res, next) => res.status(404).render('404'))
            this.app.listen(PORT, () => console.log(`Server strted on port ${PORT}`))
        } catch (err) {
            console.log(`Server stoped with error:`)
            console.log(err)
        }
    }
}

module.exports = Core
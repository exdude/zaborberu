require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
    dialect: 'mysql',
    host: process.env.MYSQL_DB
})

const Assorty = require('./models/Assorty')(sequelize)
const AssortyEu = require('./models/AssortyEu')(sequelize)
const Projects = require('./models/Projects')(sequelize)
const ProjectsEu = require('./models/ProjectsEu')(sequelize)
const Faq = require('./models/Faq')(sequelize)

module.exports = {
    sequelize : sequelize,
    assorty: Assorty,
    assortyeu: AssortyEu,
    Projects: Projects,
    ProjectsEu: ProjectsEu,
    Faq: Faq
}
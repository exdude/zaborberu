require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS, {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    logging: false
})

const Assorty = require('./models/Assorty')(sequelize)
const AssortyEu = require('./models/AssortyEu')(sequelize)
const Projects = require('./models/Projects')(sequelize)
const ProjectsEu = require('./models/ProjectsEu')(sequelize)
const Faq = require('./models/Faq')(sequelize)
const Payments = require('./models/Payments')(sequelize)
const Offices = require('./models/Points')(sequelize)
const Action = require('./models/Action')(sequelize)

module.exports = {
    sequelize : sequelize,
    assorty: Assorty,
    assortyeu: AssortyEu,
    Projects: Projects,
    ProjectsEu: ProjectsEu,
    Payments: Payments,
    Offices: Offices,
    Action: Action,
    Faq: Faq
}
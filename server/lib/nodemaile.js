require('dotenv').config
const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer')
const smtpAuth = nodemailer.createTransport(smtpTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user:  process.env.MAIL_FROM,
      pass:  process.env.MAIL_PASS
    }
}))

module.exports = (title, body, any) => {
    if (any) {
        let string = ''
        for (let key in any) {
            string += `<p><b>${key}:</b> ${any[key]}</p>`
        }

        smtpAuth.sendMail({
            from: `${title} с zaborberu.ru <${process.env.MAIL_FROM}>`,
            to: process.env.MAIL_TO,
            subject: `${title} с zaborberu.ru`,
            html:  `
                <b>${title}</b>
                ${string}
            `
        }, (error, info) => {
            if (error) throw error
        })
    }


    let form = ''
    for (let key in body) {
        form += `<span><b>${key}</b>:<p>${body[key]}</p></span><br>`
    }
    let div = `<div style="padding: 20px; border-radius: 10px; box-shadow: 0 0 65px #00000040;">${form}</div>`
    smtpAuth.sendMail({
        from: `${title} с zaborberu.ru <${process.env.MAIL_FROM}>`,
        to: process.env.MAIL_TO,
        subject: `${title} с zaborberu.ru`,
        html:  `
            <b>${title}</b>
            ${div}
        `
    }, (error, info) => {
        if (error) throw error
    })
}
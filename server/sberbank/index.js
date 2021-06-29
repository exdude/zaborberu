const sendMail = require('../components/nodemailer/index')
const uuid = require('uuid')
const fetch = require('node-fetch')
const models = require('../model/index')
const payments = models.payments
const dateFormat = require('dateformat')
const moment = require('moment')



class SberBank {
    constructor(opt) {
        this.data = opt.data
        this.type = opt.type
        this.adventure = opt.advData
        this.data.token = process.env.SBER_TOKEN
        this.data.returnUrl = process.env.SBER_URL
    }

    urlEncode(obj) {
        let form = []
        for (let key in obj) {
            let dataKey = encodeURIComponent(key)
            let dataValue = encodeURIComponent(obj[key])
            form.push(`${dataKey}=${dataValue}`)
        }
        return form.join('&')
    }

    base64(str) {
        let buff = new Buffer.from(str)
        return buff.toString('base64')
    }

    sendDataBaseAndMail(result, title) {
        sendMail(title, {
            "Ручной номер заказа": this.adventure.customNumber,
            "Сгенерированный номер заказа": this.data.orderNumber,
            "Сумма": this.data.amount / 100,
            "ФИО": this.data.description,
            "Почта": this.data.email,
            "Телефон": this.data.phone,
            "Время": (moment().format('YYYY-MM-DDTHH:MM:SS'))+'Z'
        })

        if (this.type === 'QR') {
            const data = {
                customOrderNumber: this.adventure.customNumber,
                orderNumber: this.data.orderNumber,
                count: this.data.amount / 100,
                lastName: this.data.description,
                email: this.data.email,
                phone: this.data.phone,
                delivery: this.adventure.address,
                date: (moment().format('YYYY-MM-DDTHH:MM:SS'))+'Z',
                orderId: result.orderId ? result.orderId : null,
                qrOrderId: result.order_id ? result.order_id : null,
                rq_uid: result.rq_uid ? result.rq_uid : null,
                url: result.formUrl ? result.formUrl : result.order_form_url,
                status: result.order_state,
                type: this.type,
                rq_tm: result.rq_tm
            }
    
            payments.create(data)
            .then(() => {
                console.log(`Payment sended into DB and Mail`)
            })
            .catch(err => {
                console.log(`Error db insert:`)
                console.log(err)
            })
        }
        
    }

    async cvvPayment() {
        const result = await fetch(process.env.SBER_LINK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            body: this.urlEncode(this.data)
        })
        .then(data => data.json())
        if (result.formUrl) {
            this.sendDataBaseAndMail(result, 'Оплата с помощью карты CVV, CVC')
            return {
                status: 'Success',
                result: result
            }
        } else {
            return {
                status: 'Error',
                result: result
            }
        }
        
    }

    async qrPayment() {
        const payment = await this.qrAuth()
        if (payment.status) {
            const pay = await this.qrActionPay(payment.result)
            if (pay.moreInformation) {
                return {
                    status: 'Error',
                    error: pay
                }
            } else {
                this.sendDataBaseAndMail(pay.status, 'Оплата с помощью QR-кода')
                return {
                    status: 'Success',
                    result: pay
                }
            }
            
        } else {
            return {
                status: 'Error',
                error: payment.result
            }
        }
    }

    async qrActionPay(payment) {
        const rquuid = uuid.v4().replace(/-/g, '')
        const dateNow = (moment().format('YYYY-MM-DDTHH:MM:SS'))+'Z'
        const result = await fetch(process.env.QR_CREATE, {
            method: 'POST',
            headers: {
                "x-Introspect-RqUID": rquuid,
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": 'Bearer ' + payment.access_token,
                "x-ibm-client-id": process.env.QR_CLIENT_ID
            },
            body: JSON.stringify({
            "rq_uid": rquuid,
            "rq_tm": dateNow,
            "member_id": "00000096",
            "order_number": `${this.data.orderNumber}`,
            "order_create_date": dateNow,
            "order_params_type": [
                {
                "position_name": this.adventure.address,
                "position_count": 1,
                "position_sum": Number(this.data.amount),
                "position_description": this.adventure.address
                }
            ],
            "id_qr": process.env.QR_ID,
            "order_sum": Number(this.data.amount),
            "currency": "643",
            "description": this.adventure.address
            })
        })
        .then(status => status.json())
        console.log(result)
        return result
    }

    async qrAuth() {
        const header = {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            rquid: uuid.v4().replace(/-/g, ''),
            authorization: `Basic ${this.base64(process.env.QR_CLIENT_ID+':'+process.env.QR_SECRET)}`,
            'x-ibm-client-id': process.env.QR_CLIENT_ID
        }
        const body = this.urlEncode({ grant_type: 'client_credentials', scope: process.env.QR_SCOPE })
        const result = await fetch(process.env.QR_AUTH, {
            method: 'POST',
            headers: header,
            body: body
        })
        .then(data => data.json())
        if (result.access_token) {
            return {
                status: true,
                result: result
            }
        } else {
            return {
                status: false,
                result: result
            }
        }
    }

    async init() {
        if (this.type === "CVV") return await this.cvvPayment()
        if (this.type === "QR") return await this.qrPayment()
    }
}

module.exports = SberBank
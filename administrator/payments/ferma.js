require('dotenv').config()
require('datejs-coolite')

const sendMail = require('../nodemailer/index')
const fetch = require('node-fetch')
const uuid = require('uuid')


const db = require('../db/index')
const Payments = db.Payments


class SberStatus {
    constructor(paymentOrders) {
        this.rquuid = uuid.v4().replace(/-/g, '')
        this.paymentOrders = paymentOrders
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

    async qrAuth() {
        //АВТОРИЗАЦИЯ И ПОЛУЧЕНИЯ ТОКЕНА ДЛЯ SBERBANK
        const token = await fetch(process.env.QR_AUTH , {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
                rquid: this.rquuid,
                authorization: `Basic ${this.base64(process.env.QR_CLIENT_ID+':'+process.env.QR_SECRET)}`,
                'x-ibm-client-id': process.env.QR_CLIENT_ID
            },
            body: this.urlEncode({ grant_type: 'client_credentials', scope: process.env.QR_STATUS_SCOPE })
        })
        .then(data => data.json())
        .then(data => data.access_token)
        return token
    }

     async getQrStatus(payment) {
        const header = { 
            accept: 'application/json',
            'content-type': 'application/json',
            'x-Introspect-RqUID': this.rquuid,
            authorization: `Bearer ${await this.qrAuth()}`,
            'x-ibm-client-id': process.env.QR_CLIENT_ID
        }
        const body = JSON.stringify({rq_uid: payment.rq_uid, order_id: payment.qrOrderId, rq_tm: payment.rq_tm})
        const result = await fetch(process.env.QR_STATUS, {
            method: 'POST',
            headers: header,
            body: body,
            json: true 
        })
        .then(answ => answ.json())
        .then(async answ => {
            const num = Number(payment.countpayment)
            const del = Number(process.env.QR_DELAY)
            if (payment.status === "Создан") {
                if (!num) {
                    await Payments.update({countpayment: 1},{where: {qrOrderId: opt.rq_uid}})
                } else if (payment.countpayment <= del) {
                    await Payments.update({countpayment: num + 1},{where: {qrOrderId: opt.rq_uid}})
                }else if (num >= del) {
                    await Payments.update({countpayment: 'Время оплаты вышло', status: 'Не оплачен'},{where: {qrOrderId: opt.rq_uid}})
                }
            }
            return answ
        })
        return result
    }

    checkQrStatus() {
        (async (x) => {
            let i = 0
            const intervalID = setInterval(async () => {
                const payment = this.paymentOrders[i].dataValues
                if (payment.type === "QR") {
                    if (payment.status === "CREATED") {
                        const statusOfPayment = await this.getQrStatus(payment)
                        if (statusOfPayment.status.order_state === "PAID") {
                            await Payments.update({status: 'PAID'},{where: {id: payment.id}})
                        }
                    }
                }
                i++
                if (i === x) clearInterval(intervalID)
                
            }, 1000)
        })(this.paymentOrders.length)
    }

    CHECK_FIKSALIZATION(FZDATA) {
        FZDATA.forEach(xy => {
            if (xy.dataValues.status === "PAID") {
                if (!xy.dataValues.FZ) {
                    this.DO_FIKSALIZATION(xy.dataValues) 
                }
            }
        })
    }

    async DO_FIKSALIZATION(options) {
        if (options.FZ !== "Фискализирован") {
            await fetch(`https://${process.env.OFD_LINK}/api/Authorization/CreateAuthToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({"Login": process.env.OFD_LOGIN,"Password": process.env.OFD_PASS})
            })
            .then(data => data.json())
            .then(data => {
                //АВТОРИЗАЦИЯ И ПОСЛЕДУЩАЯ ФИКСАЛИЗАЦИЯ ПЛАТЕЖА
                const CREATE_URL = `https://${process.env.OFD_LINK}/api/kkt/cloud/receipt?AuthToken=${data.Data.AuthToken}`
                const CURRENT_AMOUNT = options.count
                const QUANTITY = 1
                const INVOCEID = (new Date()).toString('yyyy1MM2dd0hh3mm4ss'+options.id)
                fetch(CREATE_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify({
                        "Request": {
                            "Inn": "6685167714",
                            "Type": "Income",
                            "InvoiceId": INVOCEID,
                            "Cashier": {
                                "Name": "СИС. АДМИНИСТРАТОР",
                                "Inn": "6685167714"
                            },
                            "CustomerReceipt": {
                                "BillAddress": "zaborberu.ru",
                                "TaxationSystem": "SimpleIn",
                                "Email": options.email,
                                "Phone": options.phone,
                                "AutomaticDeviceNumber": null,
                                "PaymentType": 1,
                                "PaymentAgentInfo": null,
                                "CorrectionInfo": null,
                                "ClientInfo": {
                                    "Name": options.lastName,
                                    "Inn": options.inn ? options.inn : null
                                },
                                "Items": [
                                    {
                                        "Label": "Забор металлический",
                                        "Price": CURRENT_AMOUNT,
                                        "Quantity": QUANTITY,
                                        "Amount": CURRENT_AMOUNT * QUANTITY,
                                        "Vat": "VatNo",
                                        "MarkingCodeStructured": null,
                                        "MarkingCode": null,
                                        "PaymentMethod": 4,
                                        "PaymentType": 1,
                                        "OriginCountryCode": "643",
                                        "CustomsDeclarationNumber": null,
                                        "PaymentAgentInfo": null
                                    }
                                ],
                                "PaymentItems": null,
                                "CustomUserProperty": null
                            }
                        }
                    })
                })
                .then(x => x.json())
                .then(async x => {
                    console.log(x);
                    if (x.Status) {
                        const ID = options.id
                        if (x.Status == 'Success') {
                            const ANSWER = 'Фискализирован'
                            const ANSWER_ID = x.Data.ReceiptId ? x.Data.ReceiptId : 'ID транзакции нет'
                            await Payments.update({FZ: ANSWER, FZ_ID: ANSWER_ID},{where: {id: ID}})
                            sendMail('Оплачен и фискализирован с помощью QR-кода', {
                                "Ручной номер заказа": options.customOrderNumber,
                                "Сгенерированный номер заказа": options.orderNumber,
                                "Сумма": options.count,
                                "ФИО": options.lastName,
                                "Почта": options.email,
                                "Телефон": options.phone,
                                "Время": new Date
                            })
                        } else {
                            const ANSWER = 'Ошибка'
                            const ANSWER_ID = x.Error.Message
                            await Payments.update({FZ: ANSWER, FZ_ID: ANSWER_ID},{where: {id: ID}})
                        }
                    }
                })
            })
        }
    }
}

/* ПРОВЕРКА ФИКСАЛИЗАЦИИ КАЖДЫЕ 5 МИНУТ */
setInterval(async () => {
    const ALL_PAYMENTS = await Payments.findAll({where: {type: 'QR'}})
    new SberStatus(ALL_PAYMENTS).checkQrStatus()
    new SberStatus().CHECK_FIKSALIZATION(ALL_PAYMENTS)
}, 60000)

module.exports = SberStatus
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

    auth() {
        //АВТОРИЗАЦИЯ И ПОЛУЧЕНИЯ ТОКЕНА ДЛЯ SBERBANK
        const token = fetch(process.env.QR_AUTH , {
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

     async getStatus(opt, x) {
        //ПОЛУЧЕНИЕ СТАТУСА ПЛАТЕЖА
        const result = await fetch(process.env.QR_STATUS, {
            method: 'POST',
            headers: 
            { 
                accept: 'application/json',
                'content-type': 'application/json',
                'x-Introspect-RqUID': this.rquuid,
                authorization: `Bearer ${await this.auth()}`,
                'x-ibm-client-id': process.env.QR_CLIENT_ID
            },
            body: JSON.stringify(opt),
            json: true 
        })
        .then(answ => answ.json())
        .then(async answ => {
            if (!x.countpayment) {
                const NEW_COUNT = 1 
                await Payments.update({countpayment: NEW_COUNT},{where: {qrOrderId: opt.rq_uid}})
                .catch(err => console.log(`Ошибка обновления стауса оплаты qr кодом`))
            } else if (x.countpayment <= process.env.QR_DELAY) {
                const GET_COUNT = x.countpayment + 1
                await Payments.update({countpayment: GET_COUNT},{where: {qrOrderId: opt.rq_uid}})
                .catch(err => console.log(`Ошибка обновления стауса оплаты qr кодом`))
            }
            if (x.countpayment === process.env.QR_DELAY) {
                await Payments.update({countpayment: 'Время оплаты вышло', status: 'Не оплачен'},{where: {qrOrderId: opt.rq_uid}})
                .catch(err => console.log(`Ошибка обновления стауса оплаты qr кодом`))
            }
            return answ
        })
        return result
    }

    qrStatus() {
        //ОБНОВЛЕНИЯ СТАТУСА ПЛАТЕЖА В ПАНЕЛИ АДМИНИСТРАТОРА
        this.paymentOrders.forEach(async (y, i) => {
            const x = y.dataValues
            const TYPE_OF_PAY = x.type
            const STATUS = x.status
            const ID = x.id
            if (TYPE_OF_PAY === 'QR') {
                if (STATUS === 'CREATED' || STATUS === 'Создан') {
                    const SYSTEM_DATA = { rq_uid: x.qrOrderId, order_id: x.orderNumber, rq_tm: x.rq_tm}
                    const STATUS_ORDER = await this.getStatus(SYSTEM_DATA, x)
                    const STATUS_PAY = STATUS_ORDER.status.order_state
                    if (STATUS_PAY === 'PAID') {
                        const ANSWER = 'Оплачен'
                        await Payments.update({status: ANSWER},{where: {id: ID}})
                        console.log(`Оплачен`);
                    }
                    if (STATUS_PAY === 'CREATED') {
                        const ANSWER = 'Создан'
                        await Payments.update({status: ANSWER},{where: {id: ID}})
                        console.log(`Создан;`)
                    }
                }
            }
        })
    }

    CHECK_FIKSALIZATION(FZDATA) {
        //ПРОВЕРКА СТАТУСА ПЛАТЕЖА ДЛЯ ФИКСАЛИЗАЦИИ
        // (function(i) {
        //     let x = 0
        //     const intervalId = setInterval(() => {
        //         x++
        //         if (FZDATA[x].dataValues.status === 'Оплачен') {
        //             if (FZDATA[x].dataValues.fz === 'Оплачен') {
        //                 this.DO_FIKSALIZATION(xy.dataValues) 
        //             }
        //         }
        //         if (i === x) clearInterval(intervalId)
        //     }, 1000)
        // })(FZDATA.length)
        FZDATA.forEach(xy => {
            if (xy.dataValues.status === 'Оплачен') {
                if (!xy.dataValues.FZ) {
                    this.DO_FIKSALIZATION(xy.dataValues) 
                }
            }
        })
    }

    async DO_FIKSALIZATION(options) {
        if (!options.FZ_ID) {
            //ПОЛУЧЕНИЕ ТОКЕНА АВТОРИЗАЦИИ
            await fetch(`https://${process.env.OFD_LINK}/api/Authorization/CreateAuthToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({"Login": process.env.OFD_LOGIN,"Password": process.env.OFD_PASS})
            })
            .catch(err => console.log(err))
            .then(data => data.json())
            .then(data => {
                //АВТОРИЗАЦИЯ И ПОСЛЕДУЩАЯ ФИКСАЛИЗАЦИЯ ПЛАТЕЖА
                const CREATE_URL = `https://${process.env.OFD_LINK}/api/kkt/cloud/receipt?AuthToken=${data.Data.AuthToken}`
                const CURRENT_AMOUNT = options.count
                const QUANTITY = 1
                const INVOCEID = (new Date()).toString('yyyy1MM2dd0hh3mm4ss'+options.id)
                fetch(CREATE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
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
                                "TaxationSystem": "Common",
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
                                        "Vat": "CalculatedVat20120",
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
                    //ОБНОВЛЕНИЕ ДАННЫХ О ФИКСАЛИЗАЦИИ ПЛАТЕЖА В ПАНЕЛИ АДМИНИСТРАТОРА
                    if (x.Status) {
                        const ID = options.id
                        if (x.Status == 'Success') {
                            const ANSWER = 'Фиксализирован'
                            console.log(x);
                            const ANSWER_ID = x.Data.ReceiptId ? x.Data.ReceiptId : 'ID транзакции нет'
                            await Payments.update({FZ: ANSWER, FZ_ID: ANSWER_ID},{where: {id: ID}})
                            sendMail('Оплачен и фиксалезирован с помощью QR-кода', {
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
                            const ANSWER_ID = 'ID not found'
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
    new SberStatus(ALL_PAYMENTS).qrStatus()
    new SberStatus().CHECK_FIKSALIZATION(ALL_PAYMENTS)
    console.log('Фиксализация');
}, 1000 * 60 * 1)

module.exports = SberStatus
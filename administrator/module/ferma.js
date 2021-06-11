require('dotenv').config()
require('datejs-coolite')


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
        const result = fetch(process.env.QR_STATUS, {
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
        .then(answ => {
            if (!x.countpayment) {
                const NEW_COUNT = 1 
                connection.query(`UPDATE payments SET countpayment='${NEW_COUNT}' where rq_uid='${opt.rq_uid}'`, err => {
                    if (err) throw err
                })
            } else if (x.countpayment <= sberConfig.delete_delay) {
                const GET_COUNT = x.countpayment + 1
                connection.query(`UPDATE payments SET countpayment='${GET_COUNT}' where rq_uid='${opt.rq_uid}'`, err => {
                    if (err) throw err
                })
            }
            if (x.countpayment === sberConfig.delete_delay) {
                const GET_COUNT = x.countpayment + 1
                connection.query(`UPDATE payments SET countpayment='${GET_COUNT}' where rq_uid='${opt.rq_uid}'`, err => {
                    if (err) throw err
                })
                connection.query(`INSERT INTO DELETEDPAYMENTS VALUES ('NULL', '${x.rq_uid}','${x.rq_tm}','${x.customOrderNumber}', '${x.realOrderNumber}', '${x.amount}','${x.order_id}','${x.order_state}','${x.order_form_url}','${x.error_code}','${x.error_discription}', '${x.name}', '${x.email}', '${x.phone}', '${x.type}')`, (err, result) => {
                    if (err) throw err
                    if (result) {
                        connection.query("DELETE FROM payments WHERE id=?", x.id, function(err, data) {
                            if (err) throw err
                        })
                    }
                })
            }
            return answ
        })
        return result
    }

    qrStatus() {
        //ОБНОВЛЕНИЯ СТАТУСА ПЛАТЕЖА В ПАНЕЛИ АДМИНИСТРАТОРА
        this.paymentOrders.forEach(async (x, i) => {
            const TYPE_OF_PAY = x.type
            const STATUS = x.order_state
            const ID = x.id
            if (TYPE_OF_PAY === 'QR') {
                if (STATUS === 'CREATED' || STATUS === 'Создан') {
                    const SYSTEM_DATA = { rq_uid: x.rq_uid, rq_tm: x.rq_tm, order_id: x.order_id}
                    const STATUS_ORDER = await this.getStatus(SYSTEM_DATA, x)
                    const STATUS_PAY = STATUS_ORDER.status.order_state
                    if (STATUS_PAY === 'PAID') {
                        const ANSWER = 'Оплачен'
                        const sql = 'UPDATE payments SET order_state=? WHERE id=?'
                        const data = [ANSWER, ID]
                        connection.query(sql, data, (err, result) => {
                            if (err) throw err
                        })
                    }
                    if (STATUS_PAY === 'CREATED') {
                        const ANSWER = 'Создан'
                        const sql = 'UPDATE payments SET order_state=? WHERE id=?'
                        const data = [ANSWER, ID]
                        connection.query(sql, data, (err, result) => {
                            if (err) throw err
                        });
                    }
                }
            }
        })
    }

    CHECK_FIKSALIZATION(FZDATA) {
        //ПРОВЕРКА СТАТУСА ПЛАТЕЖА ДЛЯ ФИКСАЛИЗАЦИИ
        FZDATA.forEach(xy => {
            if (xy.order_state == 'Оплачен') {
                if (!xy.fz) {
                    this.DO_FIKSALIZATION(xy) 
                }
            }
        })
    }

    DO_FIKSALIZATION(options) {
        //ПОЛУЧЕНИЕ ТОКЕНА АВТОРИЗАЦИИ
        fetch(`https://${process.env.OFD_AUTH_LINK}/api/Authorization/CreateAuthToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({"Login": process.env.OFD_LOGIN,"Password": process.env.OFD_PASS})
        })
        .then(data => data.json())
        .then(data => {
            //АВТОРИЗАЦИЯ И ПОСЛЕДУЩАЯ ФИКСАЛИЗАЦИЯ ПЛАТЕЖА
            const CREATE_URL = `https://${process.env.OFD_AUTH_LINK}/api/kkt/cloud/receipt?AuthToken=${data.Data.AuthToken}`
            const CURRENT_AMOUNT = options.amount / 100
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
                            "BillAddress": "zaborbest.ru",
                            "TaxationSystem": "Common",
                            "Email": options.email,
                            "Phone": options.phone,
                            "AutomaticDeviceNumber": null,
                            "PaymentType": 1,
                            "PaymentAgentInfo": null,
                            "CorrectionInfo": null,
                            "ClientInfo": {
                                "Name": options.name,
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
            .then(x => {
                //ОБНОВЛЕНИЕ ДАННЫХ О ФИКСАЛИЗАЦИИ ПЛАТЕЖА В ПАНЕЛИ АДМИНИСТРАТОРА
                if (x.Status) {
                    const ID = options.id
                    const ANSWER = x.Status == 'Success' ? 'Фиксализирован' : 'Ошибка'
                    const ANSWER_ID = x.Data.ReceiptId ? x.Data.ReceiptId : 'ID транзакции нет'
                    const sql = 'UPDATE payments SET fz=?, fz_id=? WHERE id=?'
                    const data = [ANSWER, ANSWER_ID, ID]
                    connection.query(sql, data, (err, result) => {
                        if (err) throw err
                    })
                    send(options)
                }
            })
        })
    }
}

/* ПРОВЕРКА ФИКСАЛИЗАЦИИ КАЖДЫЕ 5 МИНУТ */
setInterval(async () => {
    const ALL_PAYMENTS = await Payments.findAll({where: {type: 'QR'}}).then(result => result)
    //console.log(ALL_PAYMENTS[0].dataValues);
    // new SberStatus(ALL_PAYMENTS).qrStatus()
    // new SberStatus().CHECK_FIKSALIZATION(ALL_PAYMENTS)
}, 10000)

module.exports = SberStatus
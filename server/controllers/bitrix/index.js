const fetch = require('node-fetch')
require('dotenv').config()

class Bitrix {
    constructor (opt) {
        this.title = opt.title
        this.name = opt.name
        this.phone = opt.phone
        this.city = opt.city
        this.colors = opt.colors
        this.delivery = opt.delivery ? opt.delivery : false
        this.messenger = opt.messenger ? opt.messenger : false
        this.material = opt.material ? opt.material : 'Не указан'
        this.code_color = opt.code_color ? opt.code_color : 'Не указан'
        this.width = opt.width ? opt.width : 'Не указан'
    }

    body() {
        return {
            'fields': {
                'ASSIGNED_BY_ID': process.env.BITRIX_ID,
                'TITLE': this.title,
                'NAME': this.name,
                'PHONE': {
                    'n0': {
                        'VALUE': this.phone,
                        'VALUE_TYPE': 'WORK'
                    }
                },
                'UTM_SOURCE': 'yandex-zaborberu',
                'SOURCE_ID': 'WEBFORM',
                'UF_CRM_1586250325355': this.city
            }
        }
    }

    send() {
        fetch(process.env.BITRIX_URL, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(this.body())
        })
        .then(data => data.json())
        .then(json => {
            console.log(this.colors);
            if (this.delivery) this.comments(json, 'По возможности использовать льготную доставку: ', this.delivery ? 'Да' : 'Нет')
            if (this.messenger) this.comments(json, 'Отправить прайс по мессенджеру: ', this.messenger)
            if (this.colors) this.comments(json, `Город: ${this.city}, Выбранные свойства: `, `Материал: ${this.material}, цвет: ${this.code_color}, ширина: ${this.width}`)
        })
    }

    comments(json, title, value) {
        console.log(`Commentary`);
        const id = json.result
        const obj = {
            fields:
                {
                    "ENTITY_ID": id,
                    "ENTITY_TYPE": "lead",
                    "COMMENT": `${title} ${value}`
                }
        }
        fetch(process.env.BITRIX_COM, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
    }
}

module.exports = Bitrix
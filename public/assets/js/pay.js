import { Wigets } from './wigets.js'
const ff = new Wigets()
let form = document.querySelector('.form')
let btn = document.querySelector('.submit')
let renderOrderNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min

form.onsubmit = async e => {
    loader()
    e.preventDefault()
    let formData = new FormData(form)
    formData.append('orderNumber', renderOrderNumber(256, 10_000_000))

    let data = {
        data: {
            "orderNumber": formData.get('orderNumber'),
            "amount": formData.get('count') + '00',
            "description": formData.get('name'),
            "email": formData.get('email'),
            "phone": formData.get('phone'),
        },
        advData: {
            "address": formData.get('address'),
            "customNumber": formData.get('custom')
        },
        "type": formData.get('type'),
    }

    const result = await send(data)
    if (result.status === "Error") {
        getStatus('err', result, formData.get('type'),)
        loader(false)
    } else if (result.result.formUrl) {
        location = result.result.formUrl
        loader(false)
    } else if (result.result.status.order_form_url) {
        const qr = document.getElementById("qrcode")
        const qrblock = document.querySelector(".qr-accept")
        const accblock = document.querySelector(".accept-body")

        qrblock.style.display = "flex"
        accblock.style.display = "none"

        qr.addEventListener('click', () => {window.location = result.result.status.order_form_url})
        var qrcode = new QRCode(qr, {width : 200, height : 200});
        qrcode.makeCode(result.result.status.order_form_url)
        loader(false)
    }
}

async function send(x) {
    return await fetch('/pay', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(x)
    })
    .then(n => n.json())
}

function typePay() {
    const types = document.querySelectorAll('.form-types > label')
    let accept = document.querySelector('.accept')
    types.forEach(x => {
        x.addEventListener('click', () => {
            types.forEach(z => z.classList.remove('active'))
            x.classList.add('active')
            accept.classList.remove('disabled')
        })
    })
}

function showElem() {
    let type = document.querySelector('.type')
    const inputs = document.querySelectorAll('.form > .data > .col > label > input')
    inputs.forEach((x, i) => {
        x.oninput = e => {
            document.querySelector(`.accept-${e.target.getAttribute('name')} > span`).innerHTML = e.target.value
            if (i === 0) type.classList.remove('disabled')
        }
    })
}

function init() {
    ff.mobMenu(document.querySelector('.mob-menu'), document.querySelector('.main-menu'))
    showElem()
    typePay()
}


function getStatus(Status = 'suc', d, type) {
    console.log(d)
    const div = document.createElement('DIV')
    if (type === 'QR') div.innerHTML = d.error.moreInformation
    if (type === 'CVV') div.innerHTML = d.result.errorMessage

    if (Status === 'err') div.classList.add('error')
    if (Status === 'suc') div.classList.add('success')
    div.style.position = 'fixed'
    div.style.zIndex = '1000001'
    div.style.right = '20px'
    div.style.top = '-120px'
    div.style.animation = '1s showStatus forwards'
    setTimeout(() => {
        div.style.animation = '1s hideStatus forwards'
        setTimeout(() => {
            div.remove()
        }, 1000)
    }, 3000)
    document.body.append(div)
}

function loader(a=true) {
    const loader = document.querySelector('.load')
    if (a) {
        loader.style.display = "flex"
    } else {
        loader.style.display = "none"
    }
}

init()
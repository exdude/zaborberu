export let modals = (ff) => {
    ff.makeModal(
        document.querySelectorAll('.btn'),
        'Наши внимательные сотрудники перезвонят Вам в самое ближайшее время!',
        `<form class="br" method="POST" action="/bitrix">
            <div class="col gap mid">
                <input value="${location.pathname === ("/eu" || "/eu/") ? "Заявка еврожалюзи с сайта zaborberu.ru" : "Заявка штакетники с сайта zaborberu.ru"}" name="title" hidden>
                <input type="text" placeholder="Ваше имя" name="name" required>
                <input type="text" placeholder="Номер Вашего телефона" name="phone" required>
                <input hidden name="city" value="${cookies().data.name}">
                <label class="row mid gap-m">
                    <input type="checkbox" name="delivery" value="true">
                    <span>По возможности использовать льготную доставку</span>
                </label>
                <input type="submit" value="ЗАКАЗАТЬ С ДОСТАВКОЙ" class="btn">
            </div>
        </form>`
    )
    //whats app
    ff.makeModal(
        document.querySelectorAll('.btn'),
        'Наши внимательные сотрудники перезвонят Вам в самое ближайшее время!',
        `<form class="br" method="POST" action="/bitrix">
            <div class="col gap mid messenger">
                <input value="Получить прайс-лист на месенджер с zaborberu.ru" name="title" hidden>
                <input type="text" placeholder="Ваше имя" name="name" required>
                <input type="text" placeholder="Номер Вашего телефона" name="phone" required>
                <input hidden name="city" value="${cookies().data.name}">
                <span> Выберите мессенджер: </span>
                <div class="row gap">
                    <label class="row mid gap-m">
                        <input type="radio" name="messenger" value="whatsapp" style="position: absolute; opacity: 0;" required>
                        <i class="fab fa-whatsapp"></i>
                    </label>
                    <label class="row mid gap-m">
                        <input type="radio" name="messenger" value="viber" style="position: absolute; opacity: 0;" required>
                        <i class="fab fa-viber"></i>
                    </label>
                    <label class="row mid gap-m">
                        <input type="radio" name="messenger" value="telegram" style="position: absolute; opacity: 0;" required>
                        <i class="fab fa-telegram-plane"></i>
                    </label>
                </div>
                
                <input type="submit" value="ЗАКАЗАТЬ С ДОСТАВКОЙ" class="btn">
            </div>
            <style>
                .messenger > .row > label > i {
                    font-size: 3em;
                    filter: grayscale(50%);
                    padding: 5px;
                    transition: .5s;
                }

                .messenger > .row > label > i:hover {
                    filter: grayscale(0%);
                    background: #FAFAFA;
                    border-radius: 10px;
                }
                .messenger > .row > label > i.active {
                    filter: grayscale(0%);
                    border: 1px solid #E3E3E3;
                    border-radius: 10px;
                }

                .fa-whatsapp { color: #3dfc6d; }
                .fa-viber { color: #e449f2; }
                .fa-telegram-plane { color: #4a7bf7; }
            </style>
        </form>`,
        'messenger'
    )
}

function cookies() {
    let mArr = []
    let result = {}
    let cook = decodeURIComponent(document.cookie)
    let arr = cook.split(';') 
    arr.forEach(x => mArr.push(x.split('=')))
    mArr.forEach(x => {
        if (x[0] === 'data') {
            result[x[0]] = JSON.parse(x[1])
        } else result[x[0]] = x[1]
    })
    return result
}

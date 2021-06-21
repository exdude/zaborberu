document.addEventListener('DOMContentLoaded',  e => {
    const btns = document.querySelectorAll('.btn')
    btns.forEach(x => {
        x.addEventListener('click', async () => {
            if (x.dataset['type'] === 'add') {
                form('Добавить офис')
            } else if (x.dataset['type'] === 'edit') {
                const data = (await getData(x.dataset['id'])).result
                form('Изменить офис', x.dataset['id'], data)
                console.log(data)
            } else if (x.dataset['type'] === 'delete') {
                deleteForm(x.dataset['id'])
            }
        })
    })
})

const form = (title, id = false, data = false) => {
    const modal = document.createElement('DIV')
    modal.classList.add('modal')
    modal.insertAdjacentHTML('afterbegin',`<div class="modal-bg box">
        <div class="modal-bg__close">
            <button class="close">X</button>
        </div>
        <h3>${title}</h3>
        <form class="col gap mid" action="api" method="POST"  enctype="multipart/form-data">
            <div class="row mid gap">
                <div class="col gap-m">
                    <input hidden name="ltype" value="offices">
                    ${data ? '<input hidden name="action" value="edit">' : '<input hidden name="action" value="create">'}
                    ${data ? '<input hidden name="id" value="'+ data.id +'">' : ''}
                    <label class="col gap-m">
                        <b>Адрес:</b>
                        ${data ? '<input type="text" value="'+ data.address +'" name="address"  required>' : '<input type="text" name="address"  required>'}
                    </label>
                    <label class="col gap-m">
                        <b>График:</b>
                        <input type="text" name="schedule" ${data ? 'value="'+ data.schedule +'"' : ''} required>
                    </label>
                    <label class="col gap-m">
                        <b>Телефоны:</b>
                        <input type="text" name="phones" ${data ? 'value="'+ data.phones +'"' : ''} required>
                    </label> 
                </div>
                <div class="col gap-m">
                    <label class="col gap-m">
                        <b>Координаты:</b>
                        <input type="text" name="coords" ${data ? 'value="'+ data.coords +'"' : ''} required>
                    </label>
                    <label class="col gap-m">
                        <b>Город:</b>
                        <input type="text" name="city" ${data ? 'value="'+ data.city +'"' : ''} required>
                    </label>
                    <label class="col gap-m">
                        <b>Тип:</b>
                        <input type="text" disabled name="type" value="Терминал самовывоза ZABORBERU" required>
                    </label>
                </div>
            </div>
            <button class="btn">${data ? 'Изменить' : 'Добавить'}</button>
        </form>
    </div>
    `)
    modal.addEventListener('click', x => {
        if (x.target.classList.contains('modal')) {
            document.body.style.overflowY = "visible"
            x.target.remove()
        }
    })
    modal.children[0].addEventListener('click', x => {
        if (x.target.classList.contains('close')) {
            document.body.style.overflowY = "visible"
            modal.remove()
        }
    })
    document.body.append(modal)
}

const deleteForm = (id) => {
    const modal = document.createElement('DIV')
    modal.classList.add('modal')
    modal.insertAdjacentHTML('afterbegin',`
    <div class="modal-bg box">
        <div class="modal-bg__close">
            <button class="close">X</button>
        </div>
        <div class="mid col gap"><b>Точно удалить данные?</b> <form method="POST" action="/api"><input hidden name="id" value="${id}"><input hidden name="ltype" value="offices"><input hidden name="action" value="delete"><button class="btn delete">Удалить</button><form></div>
    </div>
    `)
    modal.addEventListener('click', x => {
        if (x.target.classList.contains('modal')) {
            document.body.style.overflowY = "visible"
            x.target.remove()
        }
    })
    modal.children[0].addEventListener('click', x => {
        if (x.target.classList.contains('close')) {
            document.body.style.overflowY = "visible"
            modal.remove()
        }
    })
    document.body.append(modal)
}

let getData = async (id) => {
    return await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "ltype": "offices",
            "action": "get_id",
            "id": id,
            "f": true
        })
    })
    .then(x => x.json())
}

let deleteData = async (id) => {
    return await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "ltype": "offices",
            "action": "delete",
            "id": id,
            "f": true
        })
    })
    .then(x => x.json())
}
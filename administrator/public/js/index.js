class Admin {
    async getData(type, id) {
        const result = await fetch('/api', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(({action: 'get_id',id: id,ltype: type, f: true}))
        })
        .then(x => x.json())
        return result
    }

    async sendData(d) {
        const result = await fetch('/api', {
            method: "POST",
            body: d
        })
        .then(x => x.json())
        this.check(result)
    }
    async addData(d) {
        const result = await fetch('/api', {
            method: "POST",
            body: d
        })
        .then(x => x.json())
        this.check(result)
    }
    async deleteData(d) {
        const result = await fetch('/api', {
            method: "POST",
            body: d
        })
        .then(x => x.json())
        this.check(result)
    }

    async init() {
        const btns = document.querySelectorAll('.btn')
        const currentLoc = location.pathname.replace(/\//gm, '')
        btns.forEach(x => {
            x.addEventListener('click', async e => {
                if (x.dataset['type'] === 'edit') {
                    const data = await this.getData(currentLoc, x.dataset['id'])
                    this.createModal('Изменить данные', this.getForm(currentLoc, data.result))
                    this.checkForEdit()
                    this.dataFromForm(currentLoc, x.dataset['type'], data)
                }
                if (x.dataset['type'] === 'add') {
                    this.createModal('Добавить данные', this.getForm(currentLoc))
                    this.dataFromForm(currentLoc, x.dataset['type'])
                }
                if (x.dataset['type'] === 'delete') {
                    this.createModal('Удалить данные?', `<div class="mid col gap"><b>Точно удалить данные?</b> <form method="POST" action="/api"><input hidden name="id" value="${x.dataset['id']}"><input hidden name="ltype" value="${currentLoc}"><input hidden name="action" value="${x.dataset['type']}"><button class="btn delete">Удалить</button><form></div>`)
                    this.dataFromForm(currentLoc, x.dataset['type'], x.dataset['id'])
                }
            })
        })


    }

    dataFromForm(currentLoc, type, data = false) {
        const form = document.querySelector('form')
        form.onsubmit = async e => {
            //const formData = new FormData(form)
            //e.preventDefault()
            // if (type === 'edit') {
            //     this.sendData(formData)
            // }
            // else if (type === 'add') {
            //     this.addData(formData)
            // }
            // else if (type === 'delete') {
            //     this.deleteData(formData)
            // }

        }
    }

    check(result) {
        if (result.status) {
            location.reload()
        } else {
            document.querySelector('modal').remove()
            this.createModal('Ошибка в данных звоним Ринату', `<div class="error">${JSON.stringify(result.result)}<div>`)
        }
    }
    checkForEdit() {
        if (document.querySelector('.link.edit')) {
            document.querySelector('.link.edit').addEventListener('click', (e) => {
                if (e.target.dataset['type'] === 'assorty') document.querySelector('.imageload').innerHTML = '<input type="file" name="scheme" >'
                if (e.target.dataset['type'] === 'projects') document.querySelector('.imageload').innerHTML = '<input type="file" name="img" >'
                
            })
        }
    }

    getForm(loc, val = false) {
        if (loc === 'assorty' || loc === 'assortyeu') {
            return `
                <form class="col gap mid" action="api" method="POST" enctype="multipart/form-data">
                    <div class="row gap">
                        <div class="col gap-m">
                            <input hidden name="ltype" value="${loc}">
                            ${val ? '<input hidden name="action" value="edit">' : '<input hidden name="action" value="create">'}
                            ${val ? '<input hidden name="id" value="'+ val.id +'">' : ''}
                            <label class="col gap-m">
                                <b>Имя:</b>
                                <input type="text" name="name" ${val ? 'value="'+ val.name +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Категория:</b>
                                <input type="text" name="category" ${val ? 'value="'+ val.category +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Цвет:</b>
                                <input type="text" name="color" ${val ? 'value="'+ val.color +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Тип:</b>
                                <input type="text" name="type" ${val ? 'value="'+ val.type +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Размер/Вид:</b>
                                <input type="text" name="size" ${val ? 'value="'+ val.size +'"' : ''} required>
                            </label>
                        </div>
                        <div class="col gap-m">
                            <label class="col gap-m">
                                <b>Края:</b>
                                <input type="text" name="edge" ${val ? 'value="'+ val.edge +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Планки:</b>
                                <input type="text" name="plank" ${val ? 'value="'+ val.plank +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Время</b>
                                <input type="text" name="time" ${val ? 'value="'+ val.time +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Цена</b>
                                <input type="text" name="count" ${val ? 'value="'+ val.count +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Схема</b>
                                ${val ? '<div class="imageload"><input disabled type="text" value="'+ val.scheme +'" name="scheme"  required> <span class="link edit" data-type="assorty">Изменить?</span></div>' : '<input type="file" name="scheme"  required>'}
                            </label>
                        </div>
                    </div>
                    <button class="btn">${val ? 'Изменить' : 'Добавить'}</button>
                </form>
            `
        }
        if (loc === 'projects' || loc === 'projectseu') {
            return `
                <form class="col gap mid" action="api" method="POST"  enctype="multipart/form-data">
                    <div class="row gap">
                        <div class="col gap-m">
                            <input hidden name="ltype" value="${loc}">
                            ${val ? '<input hidden name="action" value="edit">' : '<input hidden name="action" value="create">'}
                            ${val ? '<input hidden name="id" value="'+ val.id +'">' : ''}
                            <label class="col gap-m">
                                <b>Изображение:</b>
                                ${val ? '<div class="imageload"><input disabled type="text" value="'+ val.img +'" name="img"  required> <span class="link edit" data-type="projects">Изменить?</span></div>' : '<input type="file" name="img"  required>'}
                            </label>
                            <label class="col gap-m">
                                <b>Город:</b>
                                <input type="text" name="loc" ${val ? 'value="'+ val.loc +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Цвет:</b>
                                <input type="text" name="color" ${val ? 'value="'+ val.color +'"' : ''} required>
                            </label>
                            
                        </div>
                        <div class="col gap-m">
                            
                            <label class="col gap-m">
                                <b>Ширина:</b>
                                <input type="text" name="height" ${val ? 'value="'+ val.height +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Высота:</b>
                                <input type="text" name="width" ${val ? 'value="'+ val.width +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Тип:</b>
                                <input type="text" name="type" ${val ? 'value="'+ val.type +'"' : ''} required>
                            </label>
                            <label class="col gap-m">
                                <b>Модель:</b>
                                <input type="text" name="model" ${val ? 'value="'+ val.model +'"' : ''} required>
                            </label>
                        </div>
                    </div>
                    <button class="btn">${val ? 'Изменить' : 'Добавить'}</button>
                </form>
            `
        }
        if (loc === 'faq') {
            return `
                <form class="col gap mid" action="api" method="POST"  enctype="multipart/form-data">
                    <div class="row gap">
                        <div class="col gap-m">
                            <input hidden name="ltype" value="${loc}">
                            ${val ? '<input hidden name="action" value="edit">' : '<input hidden name="action" value="create">'}
                            ${val ? '<input hidden name="id" value="'+ val.id +'">' : ''}
                            <label class="col gap-m">
                                <b>Вопрос:</b>
                                <input type="text" name="question" ${val ? 'value="'+ val.question +'"' : ''}>
                            </label>
                            <label class="col gap-m">
                                <b>Ответ:</b>
                                <textarea type="text" name="answer" style="margin: 0px; height: 195px; width: 555px; padding: 8px;">${val ? val.answer : ''}</textarea>
                            </label>
                        </div>
                    </div>
                    <button class="btn">${val ? 'Изменить' : 'Добавить'}</button>
                </form>
            `
        }
    }

    createModal(title, body) {
        const modal = document.createElement('DIV')
        modal.classList.add('modal')
        modal.insertAdjacentHTML('afterbegin', `
            <div class="modal-bg box">
                <div class="modal-bg__close">
                    <button class="close">X</button>
                </div>
                <h3>${title}</h3>
                ${body}
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

    imageToString(img) {
        var canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)
        var dataURL = canvas.toDataURL("image/png")
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
    }
}

new Admin().init()

export default Admin
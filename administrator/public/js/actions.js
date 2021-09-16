import Admin from './index.js'
const w = new Admin()
const btns = document.querySelectorAll('.btn')
const formBody = (e) => `
        <form method="POST" style="border: 1px solid #ccc; padding: 5px;" action="/api">
            ${e ? '<input hidden name="ltype" value="edit-icon-action">' : '<input hidden name="ltype" value="edit-pdf-action">'}
            <input type="file" required>
            <button class="btn">Сохранить</button>
        </form>
`

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    });
}

const customHook = (type) => {
    const form = document.querySelector('form')
    const input = form.querySelector('input[type="file"]')
    form.addEventListener('submit', async e => {
        e.preventDefault()
        const file = await getBase64(input.files[0])
        fetch('/api', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: type === 'icon' ?
                JSON.stringify({file, ltype: 'icon'})
                :
                JSON.stringify({file, ltype: 'pdf'})
        })
        .then(x => x.json())
        .then(x => {
            if (x.status) {
                window.location = '/action'
            } else {
                document.write = 'Ошибка перезагрузите страницу'
            }
        })
    })
}


btns.forEach(x => {
    x.addEventListener('click', () => {
        console.log('click');
        if (x.dataset.edit === 'icon') {
            w.createModal('Изменить иконку', formBody(true))
            customHook(x.dataset.edit)
        }
        if (x.dataset.edit === 'pdf') {
            w.createModal('Изменить PDF', formBody(false))
            customHook(x.dataset.edit)
        }
        
    })
})



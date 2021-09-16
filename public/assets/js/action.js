
const actionBlock = document.querySelector('.action')

actionBlock.addEventListener('click', async e => {
    console.log('click');
    const mw = createModal('Акция', `
        <embed src="${actionBlock.dataset['pdf']}" width="500" height="375" type="application/pdf">
        
        </embed>
    `)

    mw.style.display = 'block'
})


const createModal = (title, body) => {
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
    modal.style.display = 'flex'
    document.body.append(modal)
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
}
function mobMenu(el, menu) {
    el.addEventListener('click', () => {
        menu.classList.toggle('active')
    })
}

document.addEventListener('DOMContentLoaded', e => {
    mobMenu(document.querySelector('.mob-menu'), document.querySelector('.main-menu'))
})
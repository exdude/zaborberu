function popup(d, m) {
    if (d) {
        document.addEventListener('mousemove', x => {
            if (x.y < 20) {
                if (document.body.offsetWidth > 460) {
                    d.style.display = "flex"
                }
            }
        })
        d.addEventListener('click', x => {
            if (x.target.classList.contains('modal')) {
                document.body.style.overflowY = "visible"
                x.target.remove()
            }
        })
        d.children[0].addEventListener('click', x => {
            if (x.target.classList.contains('close')) {
                document.body.style.overflowY = "visible"
                d.remove()
            }
        })
    } else throw console.error(`${d} not found`)
}

setTimeout(() => {
    popup(document.querySelector('.close-popup'))
}, 4000)
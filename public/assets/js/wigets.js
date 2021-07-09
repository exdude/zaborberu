
export class Wigets {
    constructor() {
        this.currentSlide = 0
    }


    mobMenu(el, menu) {
        el.addEventListener('click', () => {
            menu.style.display === 'block' ? menu.style.display = 'none' : menu.style.display = 'block'
        })
    }


    currentSlideCheck(blocks) {
        if (this.currentSlide >= blocks.length) this.currentSlide = 0 
        if (this.currentSlide < 0) this.currentSlide = blocks.length - 1
    }
    
    assorty(menu, blocks, btn) {
        blocks[this.currentSlide].classList.add('active')
        menu[this.currentSlide].classList.add('active')
        menu.forEach(x => {
            x.addEventListener('click', e => {
                menu.forEach(c => c.classList.remove('active'))
                x.classList.add('active')
                blocks.forEach(z => {
                    z.classList.remove('active')
                    if (z.dataset['block'] === e.target.dataset['btn']) {
                        z.classList.add('active')
                        this.currentSlide = (z.dataset['block'] - 1)
                    }
                })
            })
        })

        btn.forEach(x => {
            x.addEventListener('click', () => {
                if (x.classList.contains('next')) {
                    this.currentSlide++
                    this.currentSlideCheck(blocks)
                    blocks.forEach(z => z.classList.remove('active'))
                    menu.forEach(z => z.classList.remove('active'))
                    blocks[this.currentSlide].classList.add('active')
                    menu[this.currentSlide].classList.add('active')
                } else {
                    this.currentSlide--
                    this.currentSlideCheck(blocks)
                    blocks.forEach(z => z.classList.remove('active'))
                    menu.forEach(z => z.classList.remove('active'))
                    blocks[this.currentSlide].classList.add('active')
                    menu[this.currentSlide].classList.add('active')
                }
            })
        })
    }

    projectSlider(els, btns) {
        const count = els.length - 1
        const width = els[0].offsetWidth
        let current = 0
        btns.forEach(x => {
            x.addEventListener('click', () => {
                if (x.classList.contains('next')) {
                    current = current - width
                    check()
                    els[0].style.marginLeft = `${current}px`
                }
                if (x.classList.contains('back')) {
                    current = current + width
                    check()
                    els[0].style.marginLeft = `${current}px`
                }

            })
        })

        let check = () => current < -(count * width) ? current = 0 : current > 0 ? current = -(count * width) : false
    }

    faq(coll) {
        var i
        for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active")
            var content = this.nextElementSibling
            if (content.style.maxHeight){
            content.style.maxHeight = null
            } else {
            content.style.maxHeight = content.scrollHeight + "px";
            } 
        })
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
        return modal
    }

    makeModal(btns, title, body, type='order') {
        btns.forEach(x => {
            if (x.dataset[type]) {
                x.addEventListener('click', () => {
                    document.body.style.overflowY = "hidden"
                    document.body.append(this.createModal(title, body))
                    if (type==='messenger') this.messengers()
                })
            }
        })
    }

    messengers() {
        const messengers = document.querySelectorAll('.messenger > .row > label > i')
        if (messengers) {
            messengers.forEach(x => {
                x.addEventListener('click', e => {
                    messengers.forEach(z => z.classList.remove('active'))
                    e.target.classList.add('active')
                })
            })
        }
    }

    openImgs() {
        const a = document.querySelectorAll('a, div')
        a.forEach(x => {
            if (x.dataset['open']) {
                x.addEventListener('click', () => {
                    document.body.style.overflowY = "hidden"
                    document.body.append(this.createModal('', `<img src="${x.dataset['open']}"> `))
                })
            }
        })
    }
    openVid() {
        const a = document.querySelectorAll('a, div')
        a.forEach(x => {
            if (x.dataset['vid']) {
                x.addEventListener('click', () => {
                    document.body.style.overflowY = "hidden"
                    document.body.append(this.createModal('', `<video ${window.innerWidth < 500 ? 'width="280" height="150"' : ''} controls="controls" src="${x.dataset['vid']}"> `))
                })
            }
        })
    }
}
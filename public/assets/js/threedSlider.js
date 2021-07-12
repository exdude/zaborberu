export class ThreeDeSlider {
    constructor(opt) {
        this.el = opt.el
        this.loop = opt.loop ? opt.loop : true
        this.firstEl = opt.firstEl ? opt.firstEl - 1 : 0
    }
    mount() {
        const elements = this.el.children
        for (let i = 0; elements.length > i; i++) {
            elements[i].addEventListener('click', () => {
                this.firstEl = i
                this.positions(elements[this.firstEl], this.firstEl)
            })
        }
        this.positions(elements[this.firstEl], this.firstEl)
        this.styles(elements)
        
        this.timeOut(60000)
    }

    positions(el, i) {
        const elements = this.el.children
        const widthSpace = this.el.offsetWidth
        const middleSpace = widthSpace / 2
        const halfCard = el.offsetWidth / 2
        let current = i
        let position = ` z-index: 4; transform: translate3d(${middleSpace - halfCard}px, 0, 0); `
        let styleElements = (b, o, z, p) => `
            filter: blur(${b}px);
            opacity: ${o};
            z-index: ${z};
            transform: translate3d(${middleSpace - (p ? halfCard * p : halfCard)}px, 0, 0) scale(.7);`
            
        let f = current === 0 ? 1 : current === 1 ? 2 : current === 2 ? 3 : current === 3 ? 0 : false
        let t = current === 0 ? 2 : current === 1 ? 3 : current === 2 ? 0 : current === 3 ? 1 : false
        let h = current === 0 ? 3 : current === 1 ? 0 : current === 2 ? 1 : current === 3 ? 2 : false
        elements[current].style.cssText = position
        elements[f].style.cssText = styleElements(2, .2, 3, -1)
        elements[t].style.cssText = styleElements(2, .2, 1)
        elements[h].style.cssText = styleElements(2, .2, 2, 3)
    }

    timeOut(l) {
        (function(i, that) {
            const elements = that.el.children
            setTimeout(() => {
                that.firstEl > 3 ? that.firstEl = 0 : false
                that.positions(elements[that.firstEl], that.firstEl)
                that.firstEl++
            }, 0)
            setInterval(() => {
                that.firstEl > 3 ? that.firstEl = 0 : false
                that.positions(elements[that.firstEl], that.firstEl)
                that.firstEl++
            }, l)
        })(l, this)
    }

    styles(elements) {
        const styles = document.createElement('style')
        styles.innerHTML = `
        .${this.el.getAttribute('class')} > .${elements[0].getAttribute('class')} {
                transition: .4s;
                position: absolute;
                user-select: none;
            }

            @keyframes fly {
                0% { transform: rotate(0turn); }
                50% { transform: rotate(0.5turn); }
                100% { transform: rotate(0turn); }
            }
        `
        document.body.append(styles)
    }
}
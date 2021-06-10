import { Wigets } from './wigets.js'

export class PickCity extends Wigets{
    async getCityList() {
        let list = []
        let sortCities = {}
        const cities = await fetch('https://neftekamsk.zaborbest.ru/api?city=true').then(d => d.json())
        cities.forEach(x => list.push(x.name))
        const listAlph = list.sort()
        for (let i = 0; i < listAlph.length; i++) {
            let f = listAlph[i].split('')[0]
            sortCities[f] = []
        }
        listAlph.sort((a, b) => {
            let f = a.split('')[0]
            let s = b.split('')[0]
            if ((f === s) && !(a === b)) {
                sortCities[f].push(a)
            }
        })
        return sortCities
    }

    async createList() {
        const list = await this.getCityList()
        const cityButton = document.querySelector('.location > p > span')
        let box = document.createElement('div')
        let elements = []
        for (let key in list) {
            let block = document.createElement('div')
            let name = document.createElement('h3') 
            let listCity = document.createElement('ul')
            block.append(name)
            block.append(listCity)
            name.innerHTML = key
            block.classList.add('citieslist-list')
            list[key].forEach(x => listCity.insertAdjacentHTML('afterbegin', `<a class="link" href="https://${rtl(x).toLowerCase()}.zaborberu.ru"><li>${x}</li></a>`))
            elements.push(block)
        }
        elements.forEach(x => box.append(x))
        cityButton.addEventListener('click', e => {
            document.body.style.overflowY = "hidden"
            document.body.append(this.createModal('Выберите город:', `<div class="citieslist gap">${box.innerHTML}</div>`))
        })
        
        this.showAskDisplay(box.innerHTML)
    }

    showAskDisplay(g) {
        const btns = document.querySelectorAll('.location-question > .row > button')
        const askWindow = document.querySelector('.location-question')
        if (localStorage.getItem('t') > 0) {
            askWindow.style.display = 'none'
            const intervalId = setInterval(() => {
                let v = localStorage.getItem('t')
                v--
                localStorage.setItem('t', v)
                if (v < 0) {
                    clearInterval(intervalId)
                    localStorage.setItem('t', 0)
                }
            }, 1000 * 60 * 1)
        } else {
            askWindow.style.display = 'flex'
        }
        btns.forEach(x => {
            x.addEventListener('click', e => {
                if (x.classList.contains('yes')) {
                    askWindow.style.display = 'none'
                    localStorage.setItem('t', 30)
                }
                if (x.classList.contains('no')) {
                    askWindow.style.display = 'none'
                    document.body.append(this.createModal('Выберите город:', `<div class="citieslist gap">${g}</div>`))
                }
            })
        })
    }

    async init() {
        this.createList()
    }
}
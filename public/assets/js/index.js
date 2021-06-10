import { ThreeDeSlider } from './threedSlider.js'
import { Wigets } from './wigets.js'
import { modals } from './modals.js'
import { PickCity } from './pickcity.js'

window.rtl = (str) => {
    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }, n_str = [];
    
    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
    
    for ( var i = 0; i < str.length; ++i ) {
        n_str.push(
                ru[ str[i] ]
            || ru[ str[i].toLowerCase() ] == undefined && str[i]
            || ru[ str[i].toLowerCase() ].toUpperCase()
        );
    }
    return n_str.join('');
}

const ff = new Wigets()

document.addEventListener('DOMContentLoaded', e => {
    new ThreeDeSlider({
        el: document.querySelector('.slider-info__slider')
    }).mount()

    //PARALAX JS
    var scene = document.querySelector('.grass-bg')
    new Parallax(scene)
    var faqOne = document.querySelector('.grass.first')
    new Parallax(faqOne)
    var faqSecond = document.querySelector('.grass.second')
    new Parallax(faqSecond)

    //MOB MENU
    ff.mobMenu(document.querySelector('.mob-menu'), document.querySelector('.main-menu'))

    //sliders
    ff.assorty(document.querySelectorAll('.types-header__btn'), document.querySelectorAll('.types-card'), document.querySelectorAll('.types-btn'))
    ff.projectSlider(document.querySelectorAll('.projects > .slider > .slider-body > .slide '), document.querySelectorAll('.slider > .btns > button'))

    //faq
    ff.faq(document.querySelectorAll('.collapsible'))

    //img modals
    ff.openImgs()

    //modals
    modals(ff)

    //PickCity
    new PickCity().init()
})

function ruToLats (str) {
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

function cookies() {
    let mArr = []
    let result = {}
    let cook = decodeURIComponent(document.cookie)
    let arr = cook.split(';') 
    arr.forEach(x => mArr.push(x.split('=')))
    mArr.forEach(x => {
        if (x[0] === 'data') {
            result[x[0]] = JSON.parse(x[1])
        } else result[x[0]] = x[1]
    })
    return result
}
setTimeout(() => {
    try {
        let data = cookies()['data']
        fetch('https://zaborbest.ru/api')
            .then(response => response.json())
            .then((dataRows) => {
                ymaps.ready(init);
                let myMap;
                function init() {
                    var geolocation = ymaps.geolocation,
                        myMap = new ymaps.Map('map', {
                            center: data.coord.split(','),
                            zoom: 10
                        }, {
                            searchControlProvider: 'yandex#search'
                        });
                        dataRows.forEach(x => {
                            const { address, phartner, telephones, schedule, coord, type } = x
                            let coordinatos = new Array()
                            let getNewPartner = ''
                            for (let i = 0; i < coord.split(",").length; i++) {
                                coordinatos.push(Number(coord.split(",")[i]));
                            }
                            if (phartner == 0) {
                                getNewPartner = ''
                            } else {
                                getNewPartner = phartner + ', '
                            }
                            let icon = () => {
                                if (type === 'Официальный партнер ЗМК "Сталькомплект"') {
                                    return 'dealer'
                                } else if (type === 'Официальный партнер ЗМК Сталькомплект') {
                                    return 'dealer'
                                } else if (type === 'Терминал самовывоза ЗМК Сталькомплект') {
                                    return 'cargo'
                                } else if (type === 'ЗМК Сталькомплект офис продаж') {
                                    return 'sale'
                                }
                            }
                            var myPlacemark = new ymaps.Placemark(coordinatos, {
                                hintContent: '<b>' + type + '</b> ' + address,
                                balloonContent: '<b>' + type + '</b> ' + '<br/>' + getNewPartner + address + '<br/><b>Телефоны:</b><br/> ' + telephones + ' <br/> <b>Время работы:</b><br/>' + schedule
                            }, {
                                iconLayout: 'default#image',
                                iconImageHref: `/assets/mapicons-${icon()}.png`,
                                iconImageClipRect: [
                                    [0, 0],
                                    [55, 57]
                                ],
                                iconImageSize: [55, 57],
                                iconImageOffset: [-28, -45]
                            });
                            myMap.geoObjects.add(myPlacemark);
                        })
                }
            });
        
        
    } catch (err) {
        console.log(err);
    }
}, 0)



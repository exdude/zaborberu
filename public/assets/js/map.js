
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
    console.log(cook);
    let arr = cook.split(';') 
    arr.forEach(x => mArr.push(x.split('=')))
    mArr.forEach(x => {
        if (x[0].indexOf("data") > -1) result[x[0]] = JSON.parse(x[1])
    })
    console.log(result);
    return result
}
setTimeout(() => {
    try {
        let data = cookies()['data']
        fetch('/map')
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
                            const { address, phones, schedule, coords, type } = x
                            let coordinatos = new Array()
                            for (let i = 0; i < coords.split(",").length; i++) {
                                coordinatos.push(Number(coords.split(",")[i]));
                            }
                            var myPlacemark = new ymaps.Placemark(coordinatos, {
                                hintContent: '<b>' + type + '</b> ' + address,
                                balloonContent: '<b>' + type + '</b> ' + '<br/>' + address + '<br/><b>Телефоны:</b><br/> ' + phones + ' <br/> <b>Время работы:</b><br/>' + schedule
                            }, {
                                iconLayout: 'default#image',
                                iconImageHref: `/assets/mapicons-cargo.png`,
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



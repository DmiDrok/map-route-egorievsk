const maps = [];
const opts = {
  layerURL : 'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=a019e0eec8e14a79ba9ba589e0468f8f',
  center: [55.381362, 39.039537],
  markers: [
    [
      [55.383166, 39.036072],
      './img/landmarks/lenin_map.png',
      '<b>Памятник В. И. Ленину</b><br><p>Основателю первого в мире Социалистического государства.</p>'
    ],
    [
      [55.380966, 39.039886],
      './img/landmarks/sold_map.png',
      '<b>Вечный огонь и мемориал Славы</b><br><p>Мемориал погибшим воинам в годы Великой Отечественной войны 1941−1945 гг.</p>',
    ],
    [
      [55.379195, 39.041467],
      './img/landmarks/nev_map.png',
      '<b>Памятник Александру Невскому</b><p>Великому князю Киевскому (1249—1263), Великому князю Владимирскому (1252—1263), полководцу, святому Русской православной церкви.</p>'
    ],
    [
      [55.379933, 39.042869],
      './img/landmarks/bard_map.png',
      '<b>Памятник Никифору Бардыгину</b><p>Крупному российскому фабриканту, купцу первой гильдии, общественному деятелю и меценату, Егорьевскому городскому голове (1872—1901).</p>'
    ]
  ]
};

initMap('map-1', opts.center, 16, 15);
initMap('map-2', opts.center, 16, 15);

maps.forEach((map) => {
  createLayer(map, opts.layerURL);
  createMarker(map, ...opts.markers[0]);
  createMarker(map, ...opts.markers[1]);
  createMarker(map, ...opts.markers[2]);
  createMarker(map, ...opts.markers[3]);
  addRoute(map, 1);
});

setCorrectLogic();
setCorrectSliders();
setCorrectLastMap();


// Иницилизация карты в DOM
function initMap(selector, center, zoom, minZoom) {
  const map = L.map(selector,
    { center, zoom, minZoom });
  maps.push(map);
}

// Отрисовка слоя карты
function createLayer(map, layerURL) {
  const layer = L.tileLayer(layerURL);
  layer.addTo(map);
}

// Отрисовка маркера на карте
function createMarker(map, coords, iconURL, description) {
  const markerIcon = createIcon(iconURL);
  const marker = L.marker(coords, { icon: markerIcon }).addTo(map);
  setDescription(marker, description);
}

// Создание иконки
function createIcon(iconURL) {
  return L.icon({
    iconUrl: iconURL,
    iconSize: [30, 30],
    shadowSize: [30, 30],
  });
}

// Установка всплывающего описания при клике на маркер
function setDescription(marker, descText) {
  marker.bindPopup(descText);
}

// Прорисовка маршрута
function addRoute(map, state) {
  const allLatLng = [
    [55.382981, 39.035817],
    [55.380676, 39.039364],
    [55.379229, 39.041520],
    [55.379933, 39.042869],
  ];
  const latlng = allLatLng.filter((item, index) => {
    if (index <= state-1) {
      return item;
    }
  });

  // Очистка других маршрутов
  for (let key in map._layers) {
    if (map._layers[key]._path) {
      map.removeLayer(map._layers[key]);
    }
  }

  const polygon = L.polygon(latlng, { color: '#0f994d' });
  if (+state === allLatLng.length) {
    polygon.bindPopup('<b>Геометрическая фигура</b><p>Треугольник</p>')
  }
  polygon.addTo(map);
}

// Логика переключения этапов
function setCorrectLogic() {
  const navLists = document.querySelectorAll('.map-nav');
  const navItems = document.querySelectorAll('.map-nav__item button');
  let map = null;

  navLists.forEach((navList) => {
    navList.addEventListener('click', (event) => {
      const clickedNav = event.target;
      map = maps[+clickedNav.closest('.map-wrapper').dataset.map-1];
      const clickedState = clickedNav.dataset.state;

      navItems.forEach((item) => {
        if (!navList.contains(item)) return;

        item.classList.remove('active');
        item.classList.remove('visited');
        if (item.dataset.state < clickedNav.dataset.state)
          item.classList.add('visited');
      });
      event.target.classList.add('active');

      addRoute(map, clickedState);
    });
  });
}

// Настройка слайдеров
function setCorrectSliders() {
  const allSliders = document.querySelectorAll('.slider');

  allSliders.forEach(slider => {
    new Swiper(slider, {
      grabCursor: true,
      speed: 800,
      preventInteractionOnTransition: true,
      keyboard: {
        enabled: true,
      },
      navigation: {
        nextEl: slider.closest('.cd-section__wrapper').querySelector('.slider__next'),
        prevEl: slider.closest('.cd-section__wrapper').querySelector('.slider__prev'),
        disabledClass: 'disabled'
      }
    });
  });
}

// Последняя карта в последний этап
function setCorrectLastMap() {
  const navItems = document.querySelectorAll('[data-map="2"] .map-nav__item button');
  addRoute(maps[maps.length-1], 4);

  for (let i = 0; i < navItems.length; i++) {
    if (i === navItems.length-1) {
      navItems[i].classList.add('active');
      continue;
    }
    if (navItems[i].classList.contains('active')) {
      navItems[i].classList.remove('active');
    }

    navItems[i].classList.add('visited');
  }
}

let map = null;
const opts = {
  layerURL : 'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=a019e0eec8e14a79ba9ba589e0468f8f',
  center: [55.381362, 39.039537],
  markers: [
    [
      [55.383142, 39.036125],
      './img/landmarks/lenin_map.png',
      '<b>Памятник В. И. Ленину</b><br><p>Основателю первого в мире Социалистического государства.</p>'
    ],
    [
      [55.380896, 39.039702],
      './img/landmarks/sold_map.png',
      '<b>Памятник Неизвестному Солдату</b><br><p>Мемориал погибшим воинам в годы Великой Отечественной войны 1941−1945 гг.</p>',
    ],
    [
      [55.379084, 39.041331],
      './img/landmarks/nev_map.png',
      '<b>Памятник Александру Невскому</b><p>Великому князю Киевскому (1249—1263), великий князю Владимирскому (1252—1263), полководцу, святому Русской православной церкви.</p>'
    ],
    [
      [55.379628, 39.042632],
      './img/landmarks/bard_map.png',
      '<b>Памятник Никифору Бардыгину</b><p>Крупному российскому фабриканту, купцу первой гильдии, общественному деятелю и меценату, Егорьевскому городскому голове (1872—1901).</p>'
    ]
  ]
};

initMap('map', opts.center, 16);
createLayer(opts.layerURL);
createMarker(...opts.markers[0]);
createMarker(...opts.markers[1]);
createMarker(...opts.markers[2]);
createMarker(...opts.markers[3]);

addRoute(1);
setCorrectLogic();
setCorrectSliders();


// Иницилизация карты в DOM
function initMap(selector, center, zoom) {
  map = L.map(selector).setView(center, zoom);
}

// Отрисовка слоя карты
function createLayer(layerURL) {
  const layer = L.tileLayer(layerURL);
  layer.addTo(map);
}

// Отрисовка маркера на карте
function createMarker(coords, iconURL, description) {
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
function addRoute(state) {
  const allLatLng = [
    [55.382981, 39.035817],
    [55.380676, 39.039364],
    [55.379229, 39.041520],
    [55.379628, 39.042632],
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
  const navList = document.querySelector('.map-nav');
  const navItems = document.querySelectorAll('.map-nav__item');

  navList.addEventListener('click', (event) => {
    const clickedNav = event.target;
    const clickedState = clickedNav.dataset.state;

    navItems.forEach((item) => {
      item.classList.remove('active');
      item.classList.remove('visited');
      if (item.dataset.state < clickedNav.dataset.state)
        item.classList.add('visited');
    });
    event.target.classList.add('active');

    addRoute(clickedState);
  });
}

function setCorrectSliders() {
  const swiper = new Swiper('.swiper', {
    grabCursor: true,
    speed: 500,
    navigation: {
      nextEl: '.slider__next',
      prevEl: '.slider__prev',
      disabledClass: 'disabled'
    }
  });
}
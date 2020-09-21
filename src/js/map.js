if(map) {
  var mapBounds = new mapboxgl.LngLatBounds();
  geojson.features.map((item) => {
    mapBounds.extend([item.geometry.coordinates.lng, item.geometry.coordinates.lat]);
  });

  mapboxgl.accessToken = api;
  let map = new mapboxgl.Map({
    container: 'map',
    bounds: mapBounds,
    fitBoundsOptions: {
      padding: {top: 50, bottom:50, left: 50, right: 50},
    },
    style: 'mapbox://styles/pandabrand/cke658mxf0q2q19qazrvo1gdy'
  });
  map.scrollZoom.disable();
  
  geojson.features.map((location) => {
    let markerEl = document.createElement('div');
    markerEl.className = 'cc-map-marker marker';
    markerEl.dataset.locationId = location.properties.id;
    markerEl.addEventListener('click', scrollToDetail);
    new mapboxgl.Marker(markerEl)
      .setLngLat(location.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<div class="cc-marker__popup"><h4>'+location.properties.title+'</h4><p>'+location.properties.address+'</p><p><a href="https://www.google.com/maps/dir/?api=1&destination='+location.geometry.coordinates.lat+','+location.geometry.coordinates.lng+'" rel="external" target="_blank">Directions</a></p>'))
      .addTo(map);
  });

  let cards = document.querySelectorAll('.card.location');
  cards.forEach(function(card) {
    let v_context, v_offset;
    if( window.innerWidth < 769 ) {
      v_offset = 280;
      v_context = window;
    } else {
      v_offset = 20;
      v_context = document.querySelector('.location-container');
    }

    new Waypoint({
      element: card,
      handler: function(direction) {
        var previousWaypoint = this.previous();
        var nextWaypoint = this.next();

        cards.forEach((card) => {
          card.classList.remove('np-previous','np-current','np-next');
        });

        if( previousWaypoint && direction === 'down' ) {
          previousWaypoint.element.classList.add('np-previous');
        }

        this.element.classList.add('np-current');

        map.flyTo({
          center:[this.element.dataset.lng, this.element.dataset.lat], 
          zoom: 17
        });

        if( nextWaypoint && direction === 'up' ) {
          nextWaypoint.element.classList.add('np-next');
        }
      },
      offset: v_offset,
      context: v_context
    });
  });
}

function scrollToElm(container, elm, duration){
  var pos = getRelativePos(elm);
  Waypoint.disableAll();
  hrhScrollTo( container, pos.top , duration, Waypoint.enableAll);
}

function getRelativePos(elm){
  var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
      cPos = elm.getBoundingClientRect(), // target pos
      pos = {};

  pos.top    = cPos.top    - pPos.top + elm.parentNode.scrollTop,
  pos.right  = cPos.right  - pPos.right,
  pos.bottom = cPos.bottom - pPos.bottom,
  pos.left   = cPos.left   - pPos.left;

  return pos;
}
    
function hrhScrollTo(element, to, duration, onDone) {
    var start = element.scrollTop,
        change = to - start - 15,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll() {
        now = performance.now();
        elapsed = (now - startTime)/1000;
        t = (elapsed/duration);

        element.scrollTop = start + change * easeInOutQuad(t);

        if( t < 1 )
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    };

    animateScroll();
}

function easeInOutQuad(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t };

var pulseElement = document.createElement('div');
pulseElement.classList.add('element');

function showIconDetails(markerElement, thisMarker) {
  thatMarker = thisMarker;
  markerElement.querySelector('.cc-map-marker').classList.add('img-icon-anim');
  markerElement.querySelector('.cc-map-marker').after(pulseElement);
}

function scrollToDetail() {
  var _id = this.dataset.locationId;
  var scrollItem = document.getElementById(_id);
  var container = document.querySelector('.location-container');
  document.querySelector('*').classList.remove('img-icon-anim');
  scrollToElm( container, scrollItem, 1 );
}

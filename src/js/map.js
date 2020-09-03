if(map) {
  let markers = L.featureGroup();
  locations.map((location) => {
    console.log(document);
    const marker_place = L.marker(location.coordinates, {icon:l_icon, riseOnHover:true, riseOffset: 3000});
    marker_place.bindPopup('<div class="cc-marker__popup"><div class="font-weight-bold">'+location.title+'</div></div>');
    markers.addLayer(marker_place);
    let cc_marker = document.getElementById( location.id );
    const layerId = markers.getLayerId(marker_place);
    cc_marker.dataset.ccMarker = layerId;
    marker_place.addEventListener('click', scrollToDetail);
  });
  markers.addTo(map);
  map.fitBounds( markers.getBounds(), [50, 50] );
  function scrollToDetail() {
    // Waypoint.disableAll();
    var _id = this._leaflet_id;
    var scrollItem = document.querySelector('[data-cc-marker="'+_id+'"]');
    var container = document.querySelector('.location-container');
    // document.querySelector('*').removeClass('img-icon-anim');
    // loadMarker(_id);
    scrollToElm( container, scrollItem, 1 );
    // container.animate({
    //   scrollTop: scrollItem.offsetTop - container.offsetTop + container.scrollTop,
    // }, 2000, function() {
    //   // Waypoint.enableAll();
    // });
  }
}

function scrollToElm(container, elm, duration){
  var pos = getRelativePos(elm);
  hrhScrollTo( container, pos.top , duration);  // duration in seconds
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

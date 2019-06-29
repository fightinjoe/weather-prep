const Maps = {
  callbacks: [],

  init : ( callback ) => {
    const URL = 'https://maps.googleapis.com/maps/api/js';

    const params = {
      key      : Config.MAPS_API,
      // callback : `Maps.callbacks[${Maps.callbacks.length}]`
      callback: "document.callback"
    }

    // Maps.callbacks.push( callback );
    Maps.callbacks = callback;
    document.callback = callback

    let ps = [];
    for( var key in params ) {
      ps.push(`${key}=${params[key]}`)
    }

    let url = `${URL}?${ps.join('&')}`;

    let jsonp = document.createElement('script');

    jsonp.src = url;
    jsonp.type = 'text/javascript';

    document.getElementsByTagName('body')[0].appendChild(jsonp);
  },

  drawMapAtLatLong : ( position, elt ) => {
    let map = new google.maps.Map(
      elt, { center:position, zoom: 8 }
    );

    // handle clicks
    map.addListener('click', (e)=>{
      console.log({lat:e.latLng.lat(), lng:e.latLng.lng()});
    })

    return map;
  },

  addMarkerAtLatLong : ( position, map ) => {
    let marker = new google.maps.Marker({
      position: position, map: map
    })
  }
}

Maps.locations = {
  NewYork : { lat: 40.731, lng: -73.983 }
}

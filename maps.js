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
      // log the lat / lng of the click
      console.log({lat:e.latLng.lat(), lng:e.latLng.lng()});

      // draw a circle where clicked
      Maps.drawCircleAtPosition( e.latLng, map );
    })

    return map;
  },

  addMarkerAtLatLong : ( position, map ) => {
    let marker = new google.maps.Marker({
      position: position, map: map
    })
  },

  drawCircleAtPosition : ( position, map ) => {
    let circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: position,
      radius: 20000
    })
  }
}

Maps.locations = {
  NewYork : { lat: 40.731, lng: -73.983 }
}

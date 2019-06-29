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

  drawMapAtLatLong : ( lat, lng, elt ) => {
    let map = new google.maps.Map(
      elt, { center:{lat:lat, lng:lng}, zoom: 4 }
    );

    return map;
  },

  addMarkerAtLatLong : ( lat, lng, map ) => {
    let marker = new google.maps.Marker({
      position: {lat:lat, lng:lng}, map: map
    })
  }
}

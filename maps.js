class Maps {
  constructor( position, elt ) {
    this.map = new google.maps.Map(
      elt, { center:position, zoom: 8 }
    );

    this.forecasts = [];

    // handle clicks
    this.map.addListener('click', (e)=>{
      // log the lat / lng of the click
      console.log({lat:e.latLng.lat(), lng:e.latLng.lng()});

      // draw a circle where clicked
      this.addForecast( e.latLng );
    })

    return map;
  }

  addForecast = ( position ) => {
    this.forecasts.push( new Forecast( position, this) );
  }

  // addMarkerAtLatLong = ( position, map ) => {
  //   let marker = new google.maps.Marker({
  //     position: position, map: map
  //   })
  // }
  //
  // drawCircleAtPosition = ( position, map ) => {
  //   let circle = new google.maps.Circle({
  //     strokeColor: '#FF0000',
  //     strokeOpacity: 0.8,
  //     strokeWeight: 2,
  //     fillColor: '#FF0000',
  //     fillOpacity: 0.35,
  //     map: map,
  //     center: position,
  //     radius: 20000
  //   });
  //
  //   Weather.forecastByGeo(
  //     {lat: position.lat(), lng: position.lng()},
  //     (d) => console.log(d)
  //   )
  //
  //   return circle;
  // }
}

Maps.loadAPI = ( callback ) => {
  const URL = 'https://maps.googleapis.com/maps/api/js';

  window.maps_api_callback = callback;

  const params = {
    key      : Config.MAPS_API,
    // callback : `Maps.callbacks[${Maps.callbacks.length}]`
    callback: "window.maps_api_callback"
  }

  let ps = [];
  for( var key in params ) {
    ps.push(`${key}=${params[key]}`)
  }

  let url = `${URL}?${ps.join('&')}`;

  let jsonp = document.createElement('script');

  jsonp.src = url;
  jsonp.type = 'text/javascript';

  document.getElementsByTagName('body')[0].appendChild(jsonp);
}

Maps.locations = {
  NewYork : { lat: 40.731, lng: -73.983 }
}

class Forecast {
  constructor( position, map ) {
    this.map = map;
    this.position = position;

    this.forecast = null;
    this.city = null;
    this.overlay = null;

    // fetch and store the weather forecast
    const pos = {lat: position.lat(), lng: position.lng()}
    Weather.forecastByGeo( pos, (data)=>{
      console.log('Forecast data', data);

      this.city = data.city;
      this.forecast = data.list;

      this.overlay = new google.maps.Circle({
        strokeWeight: 2,
        strokeOpacity: 0.8,
        fillOpacity: 0.35,
        map: this.map.map,
        center: this.position
      });

      this.showForecast(0);
    })
  }

  showForecast = (index)=>{
    let f = this.forecast[ index ];

    this.overlay.setOptions({
      radius:      10000 * (f.rain ? f.rain['3h'] : 0),
      strokeColor: "0000FF",
      fillColor:   "0000FF"
    })
  }
}

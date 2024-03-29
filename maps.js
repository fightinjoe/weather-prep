class Maps {
  constructor( position, elt ) {
    this.map = new google.maps.Map(
      elt, { center:position, zoom: 8 }
    );

    this.index = 0;

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

  next = ()=> {
    this.index = Math.min(this.index+1, this.forecasts[0].forecast.length-1);

    this.forecasts.forEach( f =>{
      f.showForecast( this.index );
    });

    this.printDate();
  }

  prev = ()=>{
    this.index = Math.max(0, this.index-1);

    this.forecasts.forEach( f =>{
      f.showForecast( this.index );
    });

    this.printDate();
  }

  printDate = ()=>{
    let f = this.forecasts[0];

    let date = f.forecast[ this.index ].dt_txt;

    document.querySelector('#date').innerHTML = date;
  }
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

      this.showForecast( this.map.index );

      this.overlay.addListener('click', this.handleClick);
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

  handleClick = ()=>{
    const elt = document.querySelector('#info');

    let f = this.forecast[ this.map.index ];

    elt.innerHTML = `
      ${ this.city.name }:
      ${ (f.rain ? f.rain['3h'] : 0) * 0.03937}"
    `;
  }
}

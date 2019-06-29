const Weather = {

  callbacks: [],

  _createURL : ( type, params, callback ) => {
    const URL = 'http://api.openweathermap.org/data/2.5/';

    params.APPID = Config.WEATHER_API;

    params.callback = `Weather.callbacks[${Weather.callbacks.length}]`;
    Weather.callbacks.push( callback );

    let ps = [];
    for( var key in params ) {
      ps.push(`${key}=${params[key]}`)
    }

    return `${URL}${type}?${ps.join('&')}`
  },

  _ajax: ( url ) => {
    let jsonp = document.createElement('script');

    jsonp.src = url;
    jsonp.type = 'text/javascript';

    document.getElementsByTagName('body')[0].appendChild(jsonp);
  },

  current: (zip, callback) => {
    let params = {
      zip: `${zip},us`,
      units: 'imperial'
    }

    let url = Weather._createURL('weather', params, callback);

    Weather._ajax( url );
  },

  forecast: (zip, callback) => {
    let params = {
      zip: `${zip},us`,
      units: 'imperial'
    }

    let url = Weather._createURL('forecast', params, callback);

    Weather._ajax( url );
  },

  kelvinToFahrenheit: (k) => {
    let temp = (k - 273.15) * 9/5 + 32;

    return `${temp.toString().match(/(^\d+.\d)/)[0]}&deg;F`;
  }
}

class Forecast {
  // Think of a constructor as being similar to initialize in Ruby
  // Instead of setting attributes like @name = name in JavaScript we say this.name = name
  constructor() {
  }

  format_json_response(city, body) {
    var jsonResponse = {}
    jsonResponse["location"] = city;
    jsonResponse["currently"] = body.currently
    jsonResponse["hourly"] = body.hourly
    jsonResponse["daily"] = body.daily

    delete jsonResponse.currently.time
    delete jsonResponse.currently.nearestStormDistance
    delete jsonResponse.currently.nearestStormBearing
    delete jsonResponse.currently.apparentTemperature
    delete jsonResponse.currently.dewPoint
    delete jsonResponse.currently.uvIndex
    delete jsonResponse.currently.ozone

    jsonResponse.hourly.data.forEach((hash) => {
      delete hash.precipType;
      delete hash.apparentTemperature;
      delete hash.dewPoint;
      delete hash.uvIndex;
      delete hash.ozone;
    });

    jsonResponse.daily.data.forEach((hash) => {
      delete hash.moonPhase;
      delete hash.temperatureHighTime;
      delete hash.temperatureLowTime;
      delete hash.apparentTemperatureHigh;
      delete hash.apparentTemperatureHighTime;
      delete hash.apparentTemperatureLow;
      delete hash.apparentTemperatureLowTime;
      delete hash.dewPoint;
      delete hash.windGustTime;
      delete hash.windBearing;
      delete hash.uvIndex;
      delete hash.uvIndexTime;
      delete hash.ozone;
      delete hash.temperatureMinTime;
      delete hash.temperatureMaxTime;
      delete hash.apparentTemperatureMax;
      delete hash.apparentTemperatureMaxTime;
      delete hash.apparentTemperatureMin;
      delete hash.apparentTemperatureMinTime;
      delete hash.precipAccumulation;
      return jsonResponse
    });
  }
}


module.exports = Forecast;

class Favorites {
  // Think of a constructor as being similar to initialize in Ruby
  // Instead of setting attributes like @name = name in JavaScript we say this.name = name
  constructor() {
  }

  format_json_response(city, body) {
    var weatherHash = {}
    weatherHash["location"] = city;
    weatherHash["currently"] = body.currently

    delete weatherHash.currently.time
    delete weatherHash.currently.nearestStormDistance
    delete weatherHash.currently.nearestStormBearing
    delete weatherHash.currently.apparentTemperature
    delete weatherHash.currently.dewPoint
    delete weatherHash.currently.uvIndex
    delete weatherHash.currently.ozone
    return weatherHash
  }
}


module.exports = Favorites;

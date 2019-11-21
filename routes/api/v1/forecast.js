require('dotenv').config();
var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const rp = require('request-promise');

let latitude;
let longitude;

router.get('/', (request, response) => {
  var options = {
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
          key: process.env.GOOGLE_API_KEY,
          address: request.query.location
      },
      json: true
  };

rp(options).then(body => {
    latitude = body.results[0].geometry.location.lat;
    longitude = body.results[0].geometry.location.lng;

    var options2 = {
        uri: `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${latitude},${longitude}?exclude=minutely`,
        json: true
    };

    rp(options2).then(body2 => {
      var jsonResponse = {}
      jsonResponse["location"] = request.query.location;
      jsonResponse["currently"] = body2.currently
      jsonResponse["hourly"] = body2.hourly
      jsonResponse["daily"] = body2.daily

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
      });
        response.status(200).json(jsonResponse)
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});
});

module.exports = router;

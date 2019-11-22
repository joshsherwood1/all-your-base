require('dotenv').config();
var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const rp = require('request-promise');
var Forecast = require('../../../models/forecast');

let latitude;
let longitude;

router.get('/', (request, response) => {
  database('users').where('api_key', request.body.api_key).then(user => {
    if (user[0].api_key != request.body.api_key) { return response.status(401).json("you are unauthorized");}
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
      var forecast = new Forecast();
      console.log(forecast.format_json_response(request.query.location, body2))
      var jsonResponse = forecast.format_json_response(request.query.location, body2)
        response.status(200).json(jsonResponse)
    }).catch(err => {
        response.status(500).json({ error });
    });
  });
  }).catch(error => {
      response.status(401).json("you are unauthorized");
  });
});

module.exports = router;

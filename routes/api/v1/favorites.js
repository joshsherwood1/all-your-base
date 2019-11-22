require('dotenv').config();
var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const rp = require('request-promise');
var favorites_array;
var jsonResponse = [];
var Favorites = require('../../../models/favorites');

let latitude;
let longitude;


router.post('/', (request, response) => {
  database('users').where('api_key', request.body.api_key).then(user => {
    if (user[0].api_key === request.body.api_key) {
    database('favorites').insert({city: request.body.location, user_id: user[0].id}).then(() => {
    response.status(200).json({'message': `${request.body.location} has been added to your favorites`});
  }).catch((error) => {
    response.status(500).json({ error });
  });
  }
}).catch((error) => {
  response.status(401).json("you are unauthorized");
});
});



router.get('/', (request, response) => {
  database('users').where('api_key', request.body.api_key)
  .then(user => {
    return database('favorites').where( 'user_id', user[0].id)
  })
  .then((favorites) => {
    favorites_array = favorites.map(function (favorite_object) {
    return favorite_object.city
  });
    return(favorites_array)
  })
  .then((array) => {
    array.forEach((city) => {
      var options = {
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
          key: process.env.GOOGLE_API_KEY,
          address: city
      },
      json: true
  };
    rp(options).then(body => {
        latitude = body.results[0].geometry.location.lat;
        longitude = body.results[0].geometry.location.lng;
        return body.results[0].geometry.location
    })
  .then((whatIsThis) => {
      var options2 = {
          uri: `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${latitude},${longitude}?exclude=minutely`,
          json: true
      };
    rp(options2)
    .then(body2 => {
      var forecast_hash = new Favorites();
      jsonResponse.push(forecast_hash.format_json_response(city, body2))
      console.log(jsonResponse)
      });
    });
  })
    response.status(200).json(jsonResponse);
    })
    .catch((error) => {
      response.status(401).json("you are unauthorized to view this content");
    });
});

router.delete('/', (request, response) => {
  database('users').where('api_key', request.body.api_key).then(user => {
    if (user[0].api_key === request.body.api_key) {
    database('favorites').where('city', request.body.location).del().then(() => {
    response.status(204).json("status: 204");
  }).catch((error) => {
    response.status(500).json({ error });
  });
  }
}).catch((error) => {
  response.status(401).json("you are unauthorized");
});
});

module.exports = router;

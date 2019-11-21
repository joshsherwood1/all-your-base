require('dotenv').config();
var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const rp = require('request-promise');
var favorites_array;
var jsonResponse = [];
var officialResponse;

let latitude;
let longitude;

router.post('/', (request, response) => {
  database('users').where('api_key', request.body.api_key).then(user => {
    return database('favorites').insert({city: request.body.location, user_id: user[0].id})
  }).then(() => {
      response.status(200).json({'message': `${request.body.location} has been added to your favorites`});
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

router.get('/', (request, response) => {
  // console.log(request.body.api_key)
  database('users').where('api_key', request.body.api_key)

////////////////////////////////////////////////////////////////////////////////
  .then(user => {
    // console.log(user[0].id)
    return database('favorites').where( 'user_id', user[0].id)
  })

////////////////////////////////////////////////////////////////////////////////
  .then((favorites) => {
    favorites_array = favorites.map(function (favorite_object) {
    console.log(favorite_object.city)
    return favorite_object.city
});
console.log(favorites_array)
return(favorites_array)
})

////////////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////////////
.then((whatIsThis) => {
    // officialResponse = "lalaal";
    var options2 = {
        uri: `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${latitude},${longitude}?exclude=minutely`,
        json: true
    };

    rp(options2)

////////////////////////////////////////////////////////////////////////////////
    .then(body2 => {
      var weatherHash = {}
      weatherHash["location"] = city;
      weatherHash["currently"] = body2.currently

      delete weatherHash.currently.time
      delete weatherHash.currently.nearestStormDistance
      delete weatherHash.currently.nearestStormBearing
      delete weatherHash.currently.apparentTemperature
      delete weatherHash.currently.dewPoint
      delete weatherHash.currently.uvIndex
      delete weatherHash.currently.ozone
      jsonResponse.push(weatherHash)
      console.log(jsonResponse)

      // response.status(200).json(jsonResponse);
    });
  });
})
    console.log(jsonResponse)
    console.log("Am I getting here?")
    console.log(officialResponse)
      response.status(200).json(jsonResponse);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// router.get('/', (request, response) => {
//   // console.log(request.body.api_key)
//   database('users').where('api_key', request.body.api_key).then(user => {
//     // console.log(user[0].id)
//     return database('favorites').where( 'user_id', user[0].id)
//   }).then((favorites) => {
//     console.log(favorites)
//       response.status(200).json(favorites);
//     })
//     .catch((error) => {
//       response.status(500).json({ error });
//     });
// });

module.exports = router;

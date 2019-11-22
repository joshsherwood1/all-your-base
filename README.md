## Introduction

The name of this application is Express Sweater Weather. The application allows users to get the current weather and forecast data for a city. Users can also add and remove locations as favorites, and get the current weather forecasts for all of their favorite cities.

Part of this application [was initally made with Ruby on Rails](https://github.com/joshsherwood1/sweater_weather). The goal of this project was to recreate parts of the application using an Express framework instead. 

## Initial Setup

First, run:

`npm install`

Instructions to create database, run migrations, and seed: 

```
psql
CREATE DATABASE sweater_weather_dev;
\q

knex migrate:latest
knex seed:run
```
If you want to name the database differently, be sure to update knexfile.js accordingly,

## Running your tests

First, set up your test database.

```
psql
CREATE DATABASE sweater_weather_dev_test;
\q

knex migrate:latest --env test
```

Then run the command: 

`npm test`



## How to Use

The application is hosted here on Heroku: https://sweater-weather-javascript.herokuapp.com/

Access all four endpoint using Postman by clicking the button below:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5f110073b236340d109d) 

If you would like to access the four enpoints using a local server, then you will will need the following information to format each request:

```
GET /api/v1/forecast?location=denver,co
Content-Type: application/json
Accept: application/json

body:
{
  "api_key": "878uahfa8y89aydf89yas98fyas9h"
}
```

```
POST /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "London, UK",
  "api_key": "878uahfa8y89aydf89yas98fyas9h"
}
```

```
GET /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "api_key": "878uahfa8y89aydf89yas98fyas9h"
}
```

```
DELETE /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "London, UK",
  "api_key": "878uahfa8y89aydf89yas98fyas9h"
}
```

## Schema Design

![image](https://user-images.githubusercontent.com/49769068/69401316-fc4ef880-0cb1-11ea-983c-bd081e2a288a.png)

## Tech Stack List

Node.js v10.16.3
Database: Postgres & Knex


## Core Contributors

Joshua Sherwood

![image](https://user-images.githubusercontent.com/49769068/69402622-a11f0500-0cb5-11ea-865e-13c0ba4e5c3b.png)

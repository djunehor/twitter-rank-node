'use strict'

/*
|--------------------------------------------------------------------------
| CitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const City = use('App/Models/City')
const fetch = require('node-fetch');

var url = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json';
let settings = { method: "Get" };

class CitySeeder {
  async run() {
    fetch(url, settings)
      .then(res => res.json())
      .then(async (data) => {
          // data is already parsed as JSON:
          let insertedCities = await City.createMany(data);
          console.log('cities', insertedCities.length)
        });
  }
}

module.exports = CitySeeder

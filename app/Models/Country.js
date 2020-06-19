'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Country extends Model {
  static get createdAtColumn () {
    return null
  }
  static get updatedAtColumn () {
    return null
  }

  regions () {
    return this.hasMany('App/Models/Region', 'country_id')
  }

  cities () {
    return this.hasMany('App/Models/City', 'city_id')
  }
}

module.exports = Country

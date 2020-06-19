'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class City extends Model {
  static get createdAtColumn () {
    return null
  }
  static get updatedAtColumn () {
    return null
  }
  region () {
    return this.belongsTo('App/Models/Region', 'state_id')
  }

  country () {
    return this.belongsTo('App/Models/Country', 'country_id')
  }
}

module.exports = City

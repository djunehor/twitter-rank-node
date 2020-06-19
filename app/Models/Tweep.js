'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tweep extends Model {
  country () {
    return this.belongsTo('App/Models/Country', 'country_id')
  }
  city () {
    return this.belongsTo('App/Models/City', 'city_id')
  }
  region () {
    return this.belongsTo('App/Models/Region', 'region_id')
  }
  static castDates (field, value) {
    if (field === 'creation_date') {
      return `${value.format('YYYY-MM-DD HH:mm:ss').toString()} old`
    }
    return super.formatDates(field, value)
  }

  static formatDates (field, value) {
    if (field === 'creation_date') {
      return value.format('YYYY-MM-DD HH:mm:ss').toString()
    }
    return super.formatDates(field, value)
  }
}

module.exports = Tweep

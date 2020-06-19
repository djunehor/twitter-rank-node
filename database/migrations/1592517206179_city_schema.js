'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CitySchema extends Schema {
  up () {
    this.create('cities', (table) => {
      table.increments()
      table.integer('state_id').unsigned();
      table.string('state_code');
      table.string('country_code');
      table.integer('country_id').unsigned();
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.string('name');
    })
  }

  down () {
    this.drop('cities')
  }
}

module.exports = CitySchema

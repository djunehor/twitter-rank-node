'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionSchema extends Schema {
  up () {
    this.create('regions', (table) => {
      table.increments()
      table.string('name')
      table.integer('country_id', 4)
      table.string('state_code', 10)
      table.string('country_code', 10)

      table.index(['country_id','name'], 'country_name');
    })
  }

  down () {
    this.drop('regions')
  }
}

module.exports = RegionSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TweepSchema extends Schema {
  up () {
    this.create('tweeps', (table) => {
      table.increments()
      table.string('id_str');
      table.string('name');
      table.string('screen_name');
      table.string('location');
      table.timestamp('creation_date').nullable();
      table.integer('followers_count').nullable().default(0);
      table.integer('statuses_count').nullable().default(0);
      table.integer('favourites_count').nullable().default(0);
      table.boolean('verified').nullable().default(0);
      table.integer('friends_count').nullable().default(0);
      table.string('description').nullable();
      table.decimal('points', 12, 2).nullable().default(0.00);
      table.boolean('protected').nullable().default(0);
      table.string('profile_image_url_https').nullable();
      table.integer('country_id').nullable();
      table.integer('region_id').nullable();
      table.integer('city_id').nullable();
      table.json('meta').nullable();
      table.string('email').nullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('tweeps')
  }
}

module.exports = TweepSchema

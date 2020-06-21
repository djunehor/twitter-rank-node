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
      table.timestamp('creation_date');
      table.integer('followers_count');
      table.integer('statuses_count');
      table.integer('favourites_count');
      table.boolean('verified');
      table.integer('friends_count');
      table.string('description');
      table.decimal('points', 12, 2).default(0.00);
      table.boolean('protected').default(0);
      table.string('profile_image_url_https').nullable();
      table.integer('country_id').nullable();
      table.integer('region_id').nullable();
      table.integer('city_id').nullable();
      table.string('meta').nullable();
      table.string('email').nullable();
      table.string('profile_image_url_http').nullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('tweeps')
  }
}

module.exports = TweepSchema

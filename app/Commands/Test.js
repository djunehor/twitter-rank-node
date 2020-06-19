'use strict'

const { Command } = require('@adonisjs/ace')
const { save_or_update_tweep, generate_tweep_ranks, rank_tweep} = use('App/Common/helpers');
const User = use('App/Models/User');
const Tweep = use('App/Models/Tweep');
var chance = require('chance').Chance();

class Test extends Command {
  static get signature () {
    return 'helpers:test'
  }

  static get description () {
    return 'Command to test helpers'
  }

  async dummyData(number) {
    let data = [];
    for(let i = 0; i < number; i++) {
      data.push({
        "id_str": chance.fbid(),
        "name": chance.name(),
        "screen_name": chance.twitter(),
        "location": `${chance.city()}, ${chance.country({ full: true })}`,
        "description": chance.sentence(),
        "followers_count": chance.integer({ min: 100, max: 1000000 }),
        "friends_count": chance.integer({ min: 100, max: 1000000 }),
        "creation_date": chance.date(),
        "favourites_count": chance.integer({ min: 100, max: 1000000 }),
        "statuses_count": chance.integer({ min: 100, max: 1000000 }),
        "verified": chance.bool(),
        "protected": chance.bool(),
        "profile_image_url_https": chance.url(),
        "meta":  JSON.stringify({is_dummy: true})
      })
    }


    return data;
  }

  async handle (args, options, auth) {
    this.info('Dummy implementation for test command')
    let user = await Tweep.query().where('meta->is_dummy', true).getCount();
    console.log(user);
    this.info('Done with everything')

  }
}

module.exports = Test

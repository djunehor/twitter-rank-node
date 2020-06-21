'use strict'

const { Command } = require('@adonisjs/ace')
const { save_or_update_tweep, generate_tweep_ranks, rank_tweep} = use('App/Common/helpers');
const User = use('App/Models/User');
const Tweep = use('App/Models/Tweep');
const moment = require('moment');
var chance = require('chance').Chance();

class Test extends Command {
  static get signature () {
    return 'helpers:test'
  }

  static get description () {
    return 'Command to test helpers'
  }

  async dummyData() {
    return {
        "id_str": chance.fbid(),
        "name": chance.name(),
        "screen_name": chance.twitter(),
        "location": `${chance.city()}, ${chance.country({ full: true })}`,
        "description": chance.sentence(),
        "followers_count": chance.integer({ min: 100, max: 1000000 }),
        "friends_count": chance.integer({ min: 100, max: 1000000 }),
        "creation_date": moment(chance.timestamp()).format('YYYY-MM-DD HH:mm:ss'),
        "favourites_count": chance.integer({ min: 100, max: 1000000 }),
        "statuses_count": chance.integer({ min: 100, max: 1000000 }),
        "verified": chance.bool(),
        "protected": chance.bool(),
        "profile_image_url_https": chance.url(),
       // "meta":  JSON.stringify({is_dummy: true})
      }
  }

  async handle (args, options, auth) {
    this.info('Dummy implementation for test command')
    let tweep = new Tweep();
    tweep.id_str = chance.fbid(),
      tweep.name= chance.name(),
      tweep.screen_name= chance.twitter(),
      tweep.location = `${chance.city()}, ${chance.country({ full: true })}`,
      tweep.description= chance.sentence(),
      tweep.followers_count= chance.integer({ min: 100, max: 1000000 }),
      tweep.friends_count= chance.integer({ min: 100, max: 1000000 }),
      tweep.creation_date = moment(chance.timestamp()).format('YYYY-MM-DD HH:mm:ss'),
      tweep.favourites_count= chance.integer({ min: 100, max: 1000000 }),
      tweep.statuses_count= chance.integer({ min: 100, max: 1000000 }),
      tweep.verified= chance.bool(),
      tweep.protected= chance.bool(),
      tweep.profile_image_url_http= chance.url(),
      tweep.meta=  JSON.stringify({is_dummy: true})


    await tweep.save();

    console.log(tweep);
    this.info('Done with everything')

  }
}

module.exports = Test

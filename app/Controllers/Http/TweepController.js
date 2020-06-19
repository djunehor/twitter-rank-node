'use strict'
const Tweep = use('App/Models/Tweep')
const {save_or_update_tweep, generate_tweep_ranks} = use("App/Common/helpers")
const Env = use('Env')
const getTwitterInfo = require('get-twitter-info');
const tokens = {
  consumer_key: Env.get('TWITTER_API_KEY'),
  consumer_secret: Env.get('TWITTER_API_SECRET'),
  access_token: Env.get('TWITTER_ACCESS_TOKEN'),
  access_token_secret: Env.get('TWITTER_ACCESS_TOKEN_SECRET')
};

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tweeps
 */
class TweepController {
  /**
   * Show a list of all tweeps.
   * GET tweeps
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({request: {qs}, response, view}) {
    let tweeps = Tweep.query().orderBy('created_at', 'desc');
    if (qs.country_id) {
      tweeps.where('country_id', qs.country_id);
    }
    if (qs.region_id) {
      tweeps.where('region_id', qs.region_id);
    }
    if (qs.city_id) {
      tweeps.where('city_id', qs.city_id);
    }

    if (qs.verified) {
      tweeps.where('verified', qs.verified);
    }

    let paginatedTweeps = await tweeps.paginate(qs.page || 1, qs.per_page || 25);

    response.send(paginatedTweeps.toJSON())
  }

  async refresh({auth, response}) {
    let user = await auth.getUser();
    await getTwitterInfo(tokens, user.username).then(async (freshUser) => {
      save_or_update_tweep(freshUser, true);
    });

    response.send({'status': 'Profile has been refreshed and points recalculated'});
  }

  async show({params:{screen_name}, response}) {
   let tweep = await Tweep.query().where('screen_name', screen_name).firstOrFail();
    tweep['rank_data'] = await generate_tweep_ranks(tweep);
    response.send(tweep)
  }
}

module.exports = TweepController

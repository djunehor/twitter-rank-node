'use strict'
const Region = use('App/Models/Region')
const City = use('App/Models/City')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with regions
 */
class RegionController {
  /**
   * Show a list of all regions in a country.
   * GET regions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({params:{id}, response}) {
    const regions = await Region.query()
      .where('country_id', id)
      .fetch();
    response.send(regions)
  }

  /**
   * Show a list of all cities in a region.
   * GET regions/:id/cities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async cities({params:{id}, response}) {
    const cities = await City.query().where('state_id', id).fetch()
    response.send(cities)
  }


}

module.exports = RegionController

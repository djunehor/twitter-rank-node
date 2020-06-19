'use strict'
const Country = use('App/Models/Country')
const Region = use('App/Models/Region')
const City = use('App/Models/City')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with countries
 */
class CountryController {
  /**
   * Show a list of all countries.
   * GET countries
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    const countries = await Country.all()
    response.send(countries)
  }

  /**
   * Show a list of all cities of a country.
   * GET countries/:id/cities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async regions ({params:{id}, response }) {
    const regions = await Region.query().where('country_id', id).fetch()
    response.send(regions)
  }

  /**
   * Show a list of all regions of a country.
   * GET countries/:id/cities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async cities ({params:{id}, response }) {
    const cities = await City.query().where('country_id', id).fetch()
    response.send(cities)
  }
}

module.exports = CountryController

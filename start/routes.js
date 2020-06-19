'use strict'
const User = use('App/Models/user')
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** .type {typeof import('.adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('login', async ({auth, response}) => {
  let user = await User.find(1);
  let token = await auth.withRefreshToken().generate(user);
  console.log(token);
  response.send(token)
});

Route.get('twitter/redirect', 'AuthController.redirect');
Route.get('twitter/callback', 'AuthController.callback');
Route.get('logout', 'AuthController.logout');

Route.get('/', 'TweepController.index').as('home');
Route.get('refresh', 'TweepController.refresh').middleware(['auth ']);
Route.get('/tweep/:screen_name', 'TweepController.show').as('show');
Route.get('/countries', 'CountryController.index');
Route.get('/countries/:id/cities', 'CountryController.cities');
Route.get('/countries/:id/regions', 'CountryController.regions');
Route.get('/regions/:id', 'RegionController.index');
Route.get('/regions/:id/cities', 'RegionController.cities');

const chance = require('chance').Chance();
const moment = require('moment');
const {test, trait} = use('Test/Suite')('TweepController Test')
const Tweep = use('App/Models/Tweep')
const User = use('App/Models/User')

let payload = () => {
  return {
    "id_str": chance.fbid(),
    "name": chance.name(),
    "screen_name": chance.twitter(),
    "location": `${chance.city()}, ${chance.country({ full: true })}`,
    "description": chance.sentence(),
    "followers_count": chance.integer({ min: 100, max: 1000000 }),
    "friends_count": chance.integer({ min: 100, max: 1000000 }),
    "creation_date": moment(chance.timestamp()).format('YYYY-MM-DD HH:mm:ss').toString(),
    "favourites_count": chance.integer({ min: 100, max: 1000000 }),
    "statuses_count": chance.integer({ min: 100, max: 1000000 }),
    "points": chance.integer({ min: 100, max: 1000 }),
    "verified": chance.bool(),
    "protected": chance.bool(),
    "profile_image_url_https": chance.url(),
    "city_id": 1,
    "country_id": 1,
    "region_id": 1,
    "meta":  JSON.stringify({is_dummy: true})
  }
}

trait('Test/ApiClient')
trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')


test('get list of tweeps', async ({client}) => {
  const response = await client.get('/').end()

response.assertStatus(200)
})


test('get list of tweeps set per page', async ({client, assert}) => {
  let page = Math.floor((Math.random() * 10) + 1)
  let perPage = Math.floor((Math.random() * 100) + 1)
  const response = await client.get(`?page=${page}&per_page=${perPage}`).end()

  response.assertStatus(200)

  let responseData = response.body
  assert.equal(responseData.perPage, perPage)
  assert.equal(responseData.page, page)
})

test('get list of tweeps set country_id', async ({client, assert}) => {
  let data = payload()
  data.country_id = Math.floor((Math.random() * 1000) + 1)
  let tweep = await Tweep.create(data);

  const response = await client.get(`?country_id=${tweep.country_id}`).end()

  let responseData = response.body.data

  var result = Object.keys(responseData).map(function(key) {
    return responseData[key];
  });

  assert.isTrue(result.filter((t) => {return (t.id_str == tweep.id_str);}).length === 1)
})

test('get list of tweeps set region_id', async ({client, assert}) => {
  let data = payload()
  data.region_id = Math.floor((Math.random() * 1000) + 1)
  let tweep = await Tweep.create(data);

  const response = await client.get(`?region_id=${tweep.region_id}`).end()

  let responseData = response.body.data

  var result = Object.keys(responseData).map(function(key) {
    return responseData[key];
  });

  assert.isTrue(result.filter((t) => {return (t.id_str == tweep.id_str);}).length === 1)
})

test('get list of tweeps set city_id', async ({client, assert}) => {
  let data = payload()
  data.city_id = Math.floor((Math.random() * 1000) + 1)
  let tweep = await Tweep.create(data);

  const response = await client.get(`?city_id=${tweep.city_id}`).end()

  let responseData = response.body.data

  var result = Object.keys(responseData).map(function(key) {
    return responseData[key];
  });

  assert.isTrue(result.filter((t) => {return (t.id_str == tweep.id_str);}).length === 1)
})

test('get list of tweeps set verified', async ({client, assert}) => {
  let data = payload()
  data.verified = 1
  let tweep = await Tweep.create(data);

  const response = await client.get(`?verified=${data.verified}`).end()

  let responseData = response.body.data

  var result = Object.keys(responseData).map(function(key) {
    return responseData[key];
  });

  assert.isTrue(result.filter((t) => {return (t.id_str == tweep.id_str);}).length === 1)
})


test('get single tweep', async ({client}) => {
  let data = payload()
  let tweep = await Tweep.findOrCreate({"id_str": data.id_str}, data);

 let trimmed = {
   "id_str": tweep.id_str,
   "name": tweep.name,
   "screen_name": tweep.screen_name
 };

  const response = await client.get(`/tweep/${tweep.screen_name}`).end()

  response.assertStatus(200)
  response.assertJSONSubset(trimmed)
})

test('refresh user profile', async ({client}) => {
  let payload = {
    email:'djunehor@gmail.com',
    password:'nothingmich',
    name:'Zacchaeus Bolaji',
    username:'djunehor',
  }
  let user = await User.findOrCreate({"email": payload.email}, payload);

  const response = await client.get(`/refresh`).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSON({'status': 'Profile has been refreshed and points recalculated'})
})

const {test, trait} = use('Test/Suite')('CountryController Test')
const Country = use('App/Models/Country')

trait('Test/ApiClient')

test('get list of countries', async ({client}) => {
  const response = await client.get('/countries').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    id: 1,
    name: 'Afghanistan'
  }])
})

test('get list of regions in a country', async ({client}) => {
  const response = await client.get('/countries/1/regions').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
      "id": 3901,
      "name": "Badakhshan",
      "country_id": 1,
      "state_code": "BDS",
      "country_code": "AF"
  }])
});

test('get list of cities in a country', async ({client}) => {
  const response = await client.get('/countries/1/cities').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    "id": 50,
    "state_id": 3889,
    "state_code": "FYB",
    "country_code": "AF",
    "country_id": 1,
    "latitude": 36.95293,
    "longitude": 65.12376,
    "name": "Andkhoy"
  }])
});

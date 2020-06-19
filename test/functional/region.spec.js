const {test, trait} = use('Test/Suite')('RegionController Test')
const Region = use('App/Models/Region')

trait('Test/ApiClient')

test('get list of cities in a region', async ({client}) => {
  const response = await client.get('/regions/1/cities').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    "id": 38592,
    "state_id": 1,
    "state_code": "SN",
    "country_code": "ET",
    "country_id": 70,
    "latitude": 7.45347,
    "longitude": 38.21189,
    "name": "Alaba Special Wereda"
  }])
})

const moment = require('moment');

const Tweep = use('App/Models/Tweep');
const Country = use('App/Models/Country');
const City = use('App/Models/City');
const Region = use('App/Models/Region');

function calculate_points(user) {
  let daysDifference = moment(user['creation_date']).diff(moment(), 'days');

  // verified = 1000 point
  let verifiedPoint = user['verified'] ? 1000 : 0;
  // 10 followers = 1 point
  let followersPoint = user['followers_count'] / 10;
  // 100 tweets = 1 point
  let tweetsPoint = user['statuses_count'] / 100;
  // 5 likes = 1 point
  let likesPoint = user['favourites_count'] / 5;
  // protected = -500 point
  let protectedPoint = 0;

  let totalPoints = followersPoint + tweetsPoint + likesPoint + verifiedPoint - protectedPoint;
  return (totalPoints / (daysDifference > 0 ? daysDifference : 1)) * 10;
}

async function get_rank(primaryKey, primaryValue, column = null, value = null) {

    let rank = Tweep.query()
      .where(primaryKey, '>', primaryValue);
    if (column && value)
      rank.where(column, value);

    let total = await rank.getCount();
    return (parseInt(total) + 1);
}

async function save_or_update_tweep(user, update = false) {
  let exploded = user['location'].split(',');
  let countryName = '';
  let cityName = '';
  if (exploded.length > 1) {
    cityName = exploded[0].trim();
    countryName = exploded[1].trim();
  } else {
    cityName = countryName = exploded[0].trim();
  }

  let country = await Country.query()
    .where("name", countryName)
    .first();

  let countryId = country ? country.id : null;

  let city = await City.query()
    .where("name", cityName)
    .first();

  let cityId = city ? city.id : null;

  let region = await Region.query()
    .where("name", cityName)
    .first();

  let regionId = region ? region.id : null;

  let payload = {
    "id_str": user['id_str'],
    "name": user['name'],
    "screen_name": user['screen_name'],
    "location": user['location'],
    "description": user['description'],
    "followers_count": user['followers_count'],
    "friends_count": user['friends_count'],
    "creation_date": user['creation_date'] ? user['creation_date'] : null,
    "favourites_count": user['favourites_count'],
    "statuses_count": user['statuses_count'],
    "verified": user['verified'],
    "protected": user['protected'],
    "profile_image_url_https": user['profile_image_url_https'],
    "points": await calculate_points(user),
    "email": user['email'] || await get_email_from_string(user['description']),
    "country_id": countryId,
    "city_id": cityId,
    "region_id": regionId
  };

  let tweep = await Tweep.query().where('id_str', payload['id_str']).first();

  if (!tweep) {
    tweep = await Tweep.create(payload);
  }
  let data = tweep.toJSON();

  if(data.city && !data.country) {
    tweep.country_id = data.city.country.id
    tweep.save();
  }

  return tweep;
}

async function rank_tweep(tweep) {
  let [world_rank, country_rank, region_rank, city_rank] = await Promise.all([
    get_rank('points', tweep.points, null, null),
    get_rank('points', tweep.points,  'country_id', tweep.country_id),
    get_rank('points', tweep.points, 'region_id', tweep.region_id),
    get_rank('points', tweep.points, 'city_id', tweep.city_id)
  ])

  tweep.meta = JSON.stringify({
        world_rank: world_rank,
        country_rank: country_rank,
        city_rank: city_rank,
        region_rank: region_rank,
      })
   tweep.save();

}

function get_email_from_string(text) {
  let regexp = "/[\._a-zA-Z0-9-]+@[\._a-zA-Z0-9-]+/i";
  const matches = text.match(regexp);
  //Log::info('EMAILS: '. json_encode(matches));
  try {
    return matches[0];
  } catch (e) {
    return null;
  }
}

function generate_rank_data(tweepRank, total, identifier = 'World') {
  let data = [];
  data['identifier'] = identifier;
  data['position'] = tweepRank;
  data['total'] = total;
  let rank = Math.round((tweepRank / total) * 100);
  data['rank'] = rank = rank > 0 ? rank : 1;
  data['rev'] = 100 - rank;

  return data;
}

async function generate_tweep_ranks(tweep) {
  let world = Tweep.query().getCount();
  let country = Tweep.query().where('country_id', tweep.country_id).getCount();
  let city = Tweep.query().where('city_id', tweep.city_id).getCount();
  let {
    worldRank,
    countryRank,
    cityRank,
    followersRank,
    countryFollowersRank,
    cityFollowersRank,
    likesRank,
    countryLikesRank,
    cityLikesRank
  } = await Promise.all([
    get_rank('points', tweep.points, null, null),
    get_rank('points', tweep.points, 'country_id', tweep.country_id),
    get_rank('points', tweep.points, 'city_id', tweep.city_id),
    get_rank('followers_count', tweep.followers_count),
    get_rank('followers_count', tweep.followers_count, 'country_id', tweep.country_id),
    get_rank('followers_count', tweep.followers_count, 'city_id', tweep.city_id),
    get_rank('favourites_count', tweep.favourites_count),
    get_rank('favourites_count', tweep.favourites_count, 'country_id', tweep.country_id),
    get_rank('favourites_count', tweep.favourites_count, 'city_id', tweep.city_id),
  ]);

  return {
    'points': {
      'name': 'Points',
      'score': tweep.points,
      'ranks': {
        'world': generate_rank_data(worldRank, world),
        'country': tweep.country_id ? generate_rank_data(countryRank, country, tweep.country.name || 'N/A') : [],
        'city': tweep.city_id ? generate_rank_data(cityRank, city, tweep.city.name || 'N/A') : [],
      },
    },
    'followers': {
      'name': 'Followers',
      'score': tweep.followers_count,
      'ranks': {
        'world': generate_rank_data(followersRank, world),
        'country': tweep.country_id ? generate_rank_data(countryFollowersRank, country, tweep.country.name || 'N/A') : [],
        'city': tweep.city_id ? generate_rank_data(cityFollowersRank, city, tweep.city.name || 'N/A') : [],
      },
    },
    'likes': {
      'name': 'Likes',
      'score': tweep.favourites_count,
      'ranks': {
        'world': generate_rank_data(likesRank, world),
        'country': tweep.country_id ? generate_rank_data(countryLikesRank, country, tweep.country.name || 'N/A') : [],
        'city': tweep.city_id ? generate_rank_data(cityLikesRank, city, tweep.city.name || 'N/A') : [],
      },
    },
  };
}


module.exports = {
  calculate_points,
  generate_rank_data,
  get_rank,
  save_or_update_tweep,
  rank_tweep,
  get_email_from_string,
  generate_tweep_ranks
}

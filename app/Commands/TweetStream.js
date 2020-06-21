'use strict'

const { Command } = require('@adonisjs/ace');
const { save_or_update_tweep } = use('App/Common/helpers');
const Env = use('Env')
const Drive = use('Drive');
let lockFile = 'twitter_fetch.lock';
var TwitterStream = require('twitter-stream-api');
var Writable        = require('stream').Writable;


var keys = {
  consumer_key : Env.get('TWITTER_API_KEY'),
  consumer_secret : Env.get('TWITTER_API_SECRET'),
  token : Env.get('TWITTER_ACCESS_TOKEN'),
  token_secret : Env.get('TWITTER_ACCESS_TOKEN_SECRET')
};

var Output = Writable({objectMode: false});
Output._write = function (obj, enc, next) {
  let tweet = JSON.parse(obj.toString());
  if(tweet['user']) {
    if(!tweet['user']['location'] || !tweet['user']['location'].toLowerCase().includes('nigeria')) {
      tweet['user']['location'] = tweet['user']['location'] ? tweet['user']['location'] + ", Nigeria" : 'Nigeria';
    }
    save_or_update_tweep(tweet['user']);
  }
  next();
};

class TweetStream extends Command {
  static get signature () {
    return 'tweet:stream'
  }

  static get description () {
    return 'Start listening for tweets'
  }

  async handle (args, options) {
    this.info('Started stream')
    const exists = await Drive.exists(lockFile);
    if(!exists) {
      await Drive.put(lockFile, Buffer.from('Hello world!'));
      this.stream();
    }

    await Drive.delete(lockFile)
  }

  async stream() {
    let vm = this;
    var Twitter = new TwitterStream(keys,false);
    Twitter.stream('statuses/filter', {
      locations: [8,9,9,10] // Nigeria
    });

    Twitter.on('connection success', function (uri) {
      vm.success('connection success', uri);
    });

    Twitter.on('connection aborted', function () {
      vm.info('connection aborted');
    });

    Twitter.on('connection error network', function () {
      vm.error('connection error network');
    });

    Twitter.on('connection error stall', function () {
      vm.error('connection error stall');
    });

    Twitter.on('connection error http', function () {
      vm.error('connection error http');
    });

    Twitter.on('connection rate limit', function () {
      vm.info('connection rate limit');
    });

    Twitter.on('connection error unknown', function () {
      vm.error('connection error unknown');
    });

    Twitter.on('data keep-alive', function () {
      vm.info('data keep-alive');
    });

    Twitter.on('data error', function () {
      vm.error('data error');
    });

    Twitter.pipe(Output);
  }
}

module.exports = TweetStream;

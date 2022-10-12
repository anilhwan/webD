const Twit = require('twit')
const notifier = require('node-notifier');
const open = require('open');
const franc = require('franc')

const apikey = 'U1DBbqfzCu9NHKJvqJMBmdtus'
const apiSecretKey = 'p5Ic0nFYbpXCIwtCdVyIaSbhqt7hrsgfvmjPkU8xHWzxj88P3m'
const accessToken = '1579752074107293696-QNYHxGTIDi4idBFrswKe1jFhcX7yxv'
const accessTokenSecret = 'M4zL3ehViHbwiPwwlSdz4tvgrBPlrSwxycLvNBdtMPF6c'

var T = new Twit({
  consumer_key:         apikey,
  consumer_secret:      apiSecretKey,
  access_token:         accessToken,
  access_token_secret:  accessTokenSecret,
});

(async () => {

    //1. GET RECENT TWEETS
    T.get('search/tweets', { q: '#tesla since:2020-04-15', count: 100 }, function(err, data, response) {
      const tweets = data.statuses
      // .map(tweet => `LANG: ${franc(tweet.text)} : ${tweet.text}`) //CHECK LANGUAGE
      .map(tweet => tweet.text)
      .filter(tweet => tweet.toLowerCase().includes('elon'));
      console.log(tweets);
    })

    // //2. REAL TIME MONITORING USING STREAM (HASHTAG)
    // var stream = T.stream('statuses/filter', { track: '#tesla' })
    // stream.on('tweet', function (tweet) {
    //     console.log(tweet.text);
    //     console.log('Language: ' + franc(tweet.text));
    //     console.log('------');
    // })

    // 3. REAL TIME MONITORING USING STREAM (LOCATION)
    var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
    var stream = T.stream('statuses/filter', { locations: sanFrancisco })
    
    //SHOW NOTIFICATION FOR EACH RECEIVED TWEET
    stream.on('tweet', function (tweet) {
      console.log(tweet.text);
      let url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

      notifier.notify({
        title: tweet.user.name,
        message: tweet.text
      });

      notifier.on('click', async function(notifierObject, options, event) {
        console.log('clicked');
        await open(url);
      });
    })
})();
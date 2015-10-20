// Description:
//   Help your team to find a place to lunch !
//   Lunchpoll will create poll with random restaurants nearby.
//
// Commands:
//   hubot lunchpoll near <text> - Configure the place for next polls
//   hubot lunchpoll start - Start the poll
//   hubot lunchpoll vote <number> - Vote in one of poll options
//   hubot lunchpoll partial - Show the partial results
//   hubot lunchpoll finish - Finish the poll

var _ = require('lodash')
var messages = require('../lib/messages')

if (process.env.NODE_ENV !== 'production') { require('dotenv').load() }
var foursquare = require('node-foursquare-venues')(
  process.env.FOURSQUARE_CLIENT_ID,
  process.env.FOURSQUARE_CLIENT_SECRET
);

module.exports = function (bot) {
  var brain = bot.brain;
  var options = [];
  var votes = [];
  var participants = {};

  brain.set('ne', '41.56322,-8.403704');
  brain.set('sw', '41.541606,-8.436277');
  brain.set('section', 'food');

  brain.set('near', 'Braga')
  brain.set('participants', participants)
  brain.set('options', options)
  brain.set('votes', votes)

  var clearPoll = function() {
    options.length = 0;
    votes.length = 0;
    _.mapKeys(participants, function(v, k) {
      delete participants[k];
    })
  }

  var isPollNotStarted = function() {
    return _.isEmpty(options);
  }

  var isUserAlreadyVoted = function(username) {
    return participants[username];
  }

  var isVoteNotValid = function(vote) {
    return typeof votes[vote] === 'undefined';
  }

  bot.respond(/lunchpoll near (.*)/i, function (res) {
    var place = res.match[1]

    brain.set('near', place)

    return res.send(messages.places(place))
  })

  bot.respond(/lunchpoll start/i, function (res) {
    if (!isPollNotStarted()) return res.send(messages.errorAlreadyStarted);

    var near = brain.get('near');
    // var params = {
    //   near: near,
    //   categoryId: messages.category,
    //   radius: 1000
    // }
    var params = {
      ne: brain.get('ne'),
      sw: brain.get('sw'),
      section: brain.get('section')
    };

    return foursquare.venues.explore(params, function(error, payload) {
      if (error === 400) return res.send(messages.errorPlaceNotFound(near));
      if (error) return res.send(error);

      var message = messages.hello(bot.name)

      var restaurants = payload.response.groups[0].items;
      // Filters out 'Café' and 'Bakery' categories
      // check https://developer.foursquare.com/categorytree
      var categories = ['4bf58dd8d48988d16d941735', '4bf58dd8d48988d16a941735'];
      var noCafes = _.filter(restaurants, function(r) {
        return !_.includes(categories, r.venue.categories[0].id);
      });
      var sampleRestaurants = _.sample(noCafes, 5);

      _.forEach(sampleRestaurants, function(r, i) {
        var venue = r.venue;
        message += (i+1) + ': ' + venue.name + ' (' + messages.url + venue.id + ')\n';
        message += venue.location.address + '\n';
        message += venue.categories[0].name + '\n\n';
        options[i] = venue;
        votes[i] = 0;
      });

      return res.send(message);
    })
  })

  bot.respond(/lunchpoll vote (.*)/i, function(res) {
    var username = res.message.user.name.toLowerCase();
    var number = res.match[1] - 1; // we've incremented the vote index by 1 for the display, so we decrement it here

    if (isUserAlreadyVoted(username)) return res.send(messages.errorAlreadyVoted(username));
    if (isPollNotStarted()) return res.send(messages.errorStart(bot.name));
    if (isVoteNotValid(number)) return res.send(messages.errorVoteNotFound);

    votes[number] += 1;
    participants[username] = true;

    return res.send(messages.thanks);
  })

  bot.respond(/lunchpoll finish/i, function(res) {
    if (isPollNotStarted()) return res.send(messages.errorStart(bot.name));

    var highest = _.last(votes.slice().sort());
    var winner = options[_.indexOf(votes, highest)];
    clearPoll();

    return res.send(messages.win(winner));
  })

  bot.respond(/lunchpoll partial/i, function(res) {
    if (isPollNotStarted()) return res.send(messages.errorStart(bot.name));

    var message = messages.partial;

    for (var i = 0; i < options.length; i++) {
      message += options[i].name + ': ' + votes[i] + ' vote(s)\n';
    }

    return res.send(message);
  })
}

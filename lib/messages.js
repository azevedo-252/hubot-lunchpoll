// Description:
//   Lunchpoll messages sent by the bot.
//
// Example:
//  messages = require('messages')
//
//  messages.url
//  => 'https://www.foursquare.com/v/'
//
//  messages.places('Berlin')
//  => 'Ok ! your next polls will consider places near Berlin'

module.exports = {
  url: 'https://www.foursquare.com/v/',

  category: '4bf58dd8d48988d1e0931735',

  thanks: 'Thanks for your vote!',

  partial: '\nThe partial result is:\n\n',

  hello: function (name) {
    return '\nHello ! I will be your garçon today.\nType ' + ('\'@' + name + ' lunchpoll vote [NUMBER]\' to choose between these places:\n\n')
  },

  win: function (winner) {
    return '\nThe winner is ...\n' + winner.name + ' at ' + winner.location.address + ' !\nEnjoy your lunch :)'
  },

  places: function (place) {
    return 'Ok ! your next polls will consider places near ' + place + '.'
  },

  errorPlaceNotFound: function (place) {
    return 'Sorry, couldn\'t find any place near ' + place + ', can you try to start another poll in a different place please ?'
  },

  errorVoteNotFound: 'Hey dude, this option doesn\'t exist. Are you trying to be funny or what?',

  errorAlreadyStarted: 'You need to finish your poll first !',

  errorStart: function (name) {
    return 'There\'s no poll started. To start a poll type \'@' + name + ' lunchpoll start\'.'
  },

  errorAlreadyVoted: function (name) {
    return 'Sorry @' + name + ', but you already voted on this poll. Don\'t try to be sneaky!'
  },

  errorPlaceNotFound: function (near) {
    return 'I couldn\'t find places near ' + near + '. You can try another place :('
  }
}

# Hubot-lunchpoll

Hubot-lunchpoll is a Hubot plugin that helps your team decide where to lunch.
The hubot will search for restaurants nearby and show options to people in the chat vote.

## Configuration

### Foursquare

You need to register at [Foursquare](https://developer.foursquare.com/) and set your credentials on these environment variables:

```
FOURSQUARE_CLIENT_ID = xxx
FOURSQUARE_CLIENT_SECRET = xxx
```

To run it locally just set these variables on a .env file in the project root and load it with
a library like [```dotenv```](https://www.npmjs.com/package/dotenv).

### Install

Install the plugin:

```
npm install hubot-lunchpoll --save
```

And add it to your ```external-scripts.json``` file:

```
[
  ...
  "hubot-lunchpoll"
  ...
]
```

## Usage 

### Starting the poll
```
hubot lunchpoll start 
```
![](http://ditrospecta.com/images/2015-10-03-hubot-plugin/plugin-start-gif.gif)
### Voting
```
hubot lunchpoll vote <number>
```
![](http://ditrospecta.com/images/2015-10-03-hubot-plugin/plugin-vote-gif.gif)
### Showing the partial results
```
hubot lunchpoll partial
```
![](http://ditrospecta.com/images/2015-10-03-hubot-plugin/plugin-partial-gif.gif)
### Finishing the poll and announcing the winner
```
hubot lunchpoll finish
```
![](http://ditrospecta.com/images/2015-10-03-hubot-plugin/plugin-finish-gif.gif)

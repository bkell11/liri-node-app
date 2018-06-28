require("dotenv").config();
var userInput = process.argv[2];
var searchRequest = process.argv[3];
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var myKeys = require("./keys.js");

var spotify = new Spotify(myKeys.spotify);
var client = new Twitter(myKeys.twitter);

switch (userInput) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        getMovies();
        break;
    case "do-what-it-says":
        doMyStuff();
        break;
    default:
        console.log("Give me an action?");
}

function getTweets() {
    var params = { count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < 20; i++) {
                console.log(tweets[i].text + " " + tweets[i].created_at);
                fs.appendFile("./log.txt", "\n" + tweets[i].text + " " + tweets[i].created_at, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
    });

}

function spotifyThis() {
    if (!searchRequest) {
        spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                console.log(data.artists[0].name + "\n" + data.name + "\n" + data.external_urls.spotify + "\n" + data.album.name);
                fs.appendFile("./log.txt", "\n" + data.artists[0].name + "\n" + data.name + "\n" + data.external_urls.spotify + "\n" + data.album.name, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    }

    else {

        spotify.search({ type: 'track', query: searchRequest, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log(data.tracks.items[0].artists[0].name + "\n" + data.tracks.items[0].name + "\n" + data.tracks.items[0].external_urls.spotify + "\n" + data.tracks.items[0].album.name);
            fs.appendFile("./log.txt", "\n" + data.tracks.items[0].artists[0].name + "\n" + data.tracks.items[0].name + "\n" + data.tracks.items[0].external_urls.spotify + "\n" + data.tracks.items[0].album.name, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }
}

function getMovies() {
    if (!searchRequest) {
        searchRequest = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?t=" + searchRequest.replace(" ", "+") + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie was came out in: " + JSON.parse(body).Year);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's rotten tomatoes is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie was made in: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("The movie's actors are: " + JSON.parse(body).Actors);

            fs.appendFile("./log.txt", "\n" + "The movie's title is: " + JSON.parse(body).Title + "\n" + "The movie was came out in: " + JSON.parse(body).Year + "\n" + "The movie's rating is: " + JSON.parse(body).imdbRating + "\n" + "The movie's rotten tomatoes is: " + JSON.parse(body).Ratings[1].Value + "The movie was made in: " + JSON.parse(body).Country + "\n" + "The movie's language is: " + JSON.parse(body).Language + "\n" + "The movie's plot is: " + JSON.parse(body).Plot + "\n" + "The movie's actors are: " + JSON.parse(body).Actors, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
}

function doMyStuff() {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        };

        newSearch = data.split(",")
        userInput = newSearch[0];
        searchRequest = newSearch[1];

        switch (userInput) {
            case "my-tweets":
                getTweets();
                break;
            case "spotify-this-song":
                spotifyThis();
                break;
            case "movie-this":
                getMovies();
                break;
            case "do-what-it-says":
                doMyStuff();
                break;
            default:
                console.log("Give me an action?");
        };

    });
};
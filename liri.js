
require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment')
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var nodeArgs = process.argv;
var arg1 = process.argv[2];
var arg2 = "";

for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        arg2 = arg2 + "+" + nodeArgs[i];
    }
    else {
        arg2 += nodeArgs[i];

    }
};

switch (arg1) {
    case 'movie-this':
        movies(arg2);
        break;
    case 'concert-this':
        concert(arg2);
        break;
    case 'spotify-this-song':
        spots(arg2);
        break;
    case 'do-what-it-says':
        dowhat(arg2);
        break;
}


function movies(arg2) {
    if(arg2 === ''){
        movies('Mr.Nobody')
    } else {
    var queryUrl = 'http://www.omdbapi.com/?t=' + arg2 + '&y=&plot=short&apikey=trilogy';
    console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {

            var data = response.data;

            console.log('Movie Title: ' + data.Title + '\nRelease Year: ' + data.Year + '\nThe IMBD movie rating is: ' + data.imdbRating + '\nThe Metacritic rating is: ' + data.Metascore + '\nCountry(s) where the movie was produced: ' + data.Country + '\nLanguages of the movie: ' + data.Language + '\nPlot: ' + data.Plot + '\nCast: ' + data.Actors);
        }
    )
    }
};

function concert(arg2) {
    var queryUrl = 'https://rest.bandsintown.com/artists/' + arg2 + '/events?app_id=codingbootcamp';
    console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            var data = response.data;

            for (i = 0; i < data.length; i++) {
                console.log('\nVenue: ' + data[i].venue.name + '\nLocation: ' + data[i].venue.city + '\nDate: ' + moment(data[i].datetime, 'YYYY-MM-DD HH:mm').format('MM/DD/YYYY'));
            }
        }
    )
};

function spots(arg2) {
    if (arg2 === "") {
        spots("The Sign")
    } else {
        spotify
            .search({ type: 'track', query: arg2 })
            .then(function (response) {
                var data = response.tracks.items[0];
                console.log('Artists: ' + data.artists[0].name + '\nSong: ' + data.name + '\nPreview Link: ' + data.preview_url + '\nAlbum: ' + data.album.name)
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};


function dowhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);

        var dataArr = data.split(',');

        switch (dataArr[0]) {
            case 'movie-this':
                movies(dataArr[1]);
                break;
            case 'concert-this':
                concert(dataArr[1]);
                break;
            case 'spotify-this-song':
                spots(dataArr[1]);
                break;
            case 'do-what-it-says':
                dowhat(dataArr[1]);
                break;
        }

    });
};
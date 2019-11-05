//-------Dependencies---------------------------------------------
require("dotenv").config();

const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const axios = require("axios");
const fs = require('fs');
const moment = require('moment')

// Constant to reference the API credentials for the song search

const spotify = new Spotify(keys.spotify);
// Constants that initiate node and accept parameters that communicate to the app what the user wants to do
const nodeArgs = process.argv;
const arg1 = process.argv[2];
const arg2 = "";

// Iterate through the args
for (var i = 3; i < nodeArgs.length; i++) {

    // If a string has been passed into arg2, then add it to nodeArgs
    if (i > 3 && i < nodeArgs.length) {
        arg2 = arg2 + "+" + nodeArgs[i];
    }

    // Otherwise, run the default switch case
    else {
        arg2 += nodeArgs[i];
    }
};

// Switch case statement: arg1 is the specific case user option
// Arg2 is the string parameter potentially passed in as a command
switch (arg1) {
    case 'movie-this':
        movies(arg2);
        break;
    case 'concert-this':
        concert(arg2);
        break;
    case 'spotify-this-song':
        thisSong(arg2);
        break;
    case 'do-what-it-says':
        itSaid(arg2);
        break;

    default:
        console.log("\n" + "User command format: 'node liri js' " + "\n" +
            "movie-this" + "<input search>" + "\n" +
            "concert-this" + "<input search>" + "\n" +
            "spotify-this-song" + "<input search>" + "\n" +
            "do-what-it-says" + "<input search>" + "\n" +

            "* Enter quotes for multiword titles");
}

// Function to display movie data
function movies(arg2) {

    // If the user does not pass in a command
    if (arg2 === '') {

        // Then return movie data about The Lawnmower Man
        movies('The Lawnmower Man')
    } else {

        // Otherwise, pass in the string entered as a command by the user into this URL
        var queryUrl = 'http://www.omdbapi.com/?t=' + arg2 + '&y=&plot=short&apikey=trilogy';

        // Axios API call to fetch the data specific to the parameters passed into the URL
        axios.get(queryUrl).then(

            // Once the data has been received...
            function (response) {

                // Inititialize variable to store the response data
                var data = response.data;

                // Console log these specfic attributes that correspond with the parameter passed into the URL
                console.log('Movie Title: ' + data.Title + '\nRelease Year: ' + data.Year + '\nThe IMBD movie rating is: ' + data.imdbRating + '\nThe Metacritic rating is: ' + data.Metascore + '\nCountry(s) where the movie was produced: ' + data.Country + '\nLanguages of the movie: ' + data.Language + '\nPlot: ' + data.Plot + '\nCast: ' + data.Actors);
            })
    }
};

// Function to display concert data
function concert(arg2) {
    // If the user does not pass in a command
    if (arg2 === '') {
        // Display data about Metallica
        concert('Metallica')
    } else {
        // Otherwise, pass in the string entered as a command by the user into this URL
        var queryUrl = 'https://rest.bandsintown.com/artists/' + arg2 + '/events?app_id=codingbootcamp';

        // Axios API call to fetch the data specific to the parameters passed into the URL

        axios.get(queryUrl).then(

            // Once the data hasbeen received...
            function (response) {

                // Initialize variable to store the response data 
                var data = response.data;

                // Console log the concert data that corresponds with the parametetrs passed into the URL
                console.log('\nArtist: ' + arg2)

                // In case the response contains data for more than one venue...
                // Iterate through the response data and display these specfic attributes
                for (i = 0; i < data.length; i++) {
                    console.log('\nVenue: ' + data[i].venue.name + '\nLocation: ' + data[i].venue.city + '\nDate: ' + moment(data[i].datetime, 'YYYY-MM-DD HH:mm').format('MM/DD/YYYY'));
                }
            })
    }
};

// Function to display song data
function thisSong(arg2) {
    
    if (arg2 === "") {
        thisSong("Del Davis Tree Farm")
    } else {
        spotify
            .search({ type: 'track', query: arg2 })
            .then(function (response) {
                const data = response.tracks.items[0];
                console.log('Artists: ' + data.artists[0].name + '\nSong: ' + data.name + '\nPreview Link: ' + data.preview_url + '\nAlbum: ' + data.album.name)
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};


function itSaid() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);

        const dataArr = data.split(', ');

        switch (dataArr[0]) {
            case 'movie-this':
                movies(dataArr[1]);
                break;
            case 'concert-this':
                concert(dataArr[1]);
                break;
            case 'spotify-this-song':
                thisSong(dataArr[1]);
                break;
            case 'do-what-it-says':
                itSaid(dataArr[1]);
                break;
        }
    });
};
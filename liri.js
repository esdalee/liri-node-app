require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

// Import keys
var keys = require("./keys.js");

// Create new spotify object
var spotify = new Spotify(keys.spotify);

// Initialize var for commands
var arg = process.argv;
var command = arg[2];
var term = arg.slice(3).join(" ");

// Constructor for Command
var LiriCommand = function() {
    // concert-this
    this.concert = function(artist) {
        // make axios call to search for concert details
        var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
        axios.get(URL).then(function(response){
            var concertData = response.data[0];
            // console.log(data);
            var venueName = concertData.venue.name;
            var city = concertData.venue.city;
            var country = concertData.venue.country;
            var location = city + ", " + country;
            var date = moment(concertData.datetime).format('MM/DD/YYYY');
            // combine all info for artist
            var concertResult = "\nArtist: " + term + "\nVenue: " + venueName + "\nLocation: " + location + "\nDate: " + date + "\n\n";
            console.log(concertResult);
            fs.appendFile("log.txt", concertResult,function(error) {
                if (error) {
                    console.log(error);
                }
            });
        }).catch(function(error){
        console.log(error);
        });
    };

    // spotify-this-song
    this.spotify = function(song) { 
        spotify.search({
            type: "track", query: song})
            .then (function(error, response) {
                if (error) { return console.log("Error: " + error)};
                var spotifyData = response.data;
                console.log(JSON.stringify(spotifyData));
                var artists = spotifyData.artists[0].name;
                var title = spotifyData.tracks[0].name;
                console.log(artists);
                console.log(title)}) 
            .catch(function(error){
            console.log("Error: " + error);
            });

        // artist(s)
        // song's name
        // preview link of song
        // album that song is from

    };

    this.movie = function(movie) {
        // make axios call to search for movie details
        var URL = "www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        axios.get(URL).then(function(response){       
            var movieData = response.data[0];
            // console.log(data);
            var title = movieData.Title;
            var year = movieData.Year;
            var imdb = movieData.imdbRating;
            var rottenTomatoes = movieData.Ratings[1].Value;
            var prodCountry = movieData.Country;
            var language = movieData.Language;
            var plot = movieData.plot;
            var actors = movieData.Actors;
            // combine all info for movie
            var movieResult = "\nTitle: " + title + "\nYear Released: " + year + "\nIMDB Rating: " + imdb + "\nRotten Tomatoes Rating: " + rottenTomatoes + 
            "\nProduced in : " + prodCountry + "\nLanguage: " + langugae + "\nPlot: " + plot + "\nActors: " + actors + "\n\n";
            console.log(movieResult);
            fs.appendFile("log.txt", movieResult,function(error) {
                if (error) {
                    console.log(error);
                }
            });
        }).catch(function(error){
        console.log(error);
        });
    };

// do-what-it-says

};

// Create liri object
var liriCommand = new LiriCommand();

// CONCERT
if (command === "concert-this") {
    console.log("Looking for concert info for " + term);
    liriCommand.concert(term);
}

// SPOTIFY
else if (command === "spotify-this-song") {
    if (!term) {
        term = "The Sign";
    }
    liriCommand.spotify(term);
}

// MOVIE
else if (command === "movie-this") {
    if (!term) {
        term = "Mr.Nobody";
    }
    term = arg.slice(3).join("+");
    liriCommand.movie(term);
};
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
            .then (function(response) {
                var spotifyData = response.tracks.items[0];
                var artist = spotifyData.artists[0].name;  
                var title =  spotifyData.name;
                var preview = spotifyData.external_urls.spotify;
                var album = spotifyData.album.name;
                // combine all info for movie
                var songResult = "\nArtist: " + artist + "\nTitle: " + title + "\nLink Preview: " + preview + "\nAlbum: " + album + "\n\n";
                console.log(songResult);
                fs.appendFile("log.txt", songResult, function(error) {
                    if (error) {
                        console.log(error);
                    }
            });
        })
            .catch(function(error){
            console.log("Error: " + error);
            });
    };

    this.movie = function(movie) {
        // make axios call to search for movie details
        var URL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
        axios.get(URL).then(function(response){
            var movieData = response.data;
            // console.log(movieData);
            var title = movieData.Title;
            var year = movieData.Year;
            var imdb = movieData.imdbRating;
            var rottenTomatoes = movieData.Ratings[1].Value;
            console.log(rottenTomatoes);
            var prodCountry = movieData.Country;
            var language = movieData.Language;
            var plot = movieData.plot;
            var actors = movieData.Actors;
            // combine all info for movie
            var movieResult = "\nTitle: " + title + "\nYear Released: " + year + "\nIMDB Rating: " + imdb + "\nRotten Tomatoes Rating: " + rottenTomatoes + 
            "\nProduced in : " + prodCountry + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\n\n";
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
};

// Run functions
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
    console.log("Looking for song info for " + term)
    liriCommand.spotify(term);
}

// MOVIE
else if (command === "movie-this") {
    // Without specific movie
    if (!term) {
        term = "Mr.Nobody";
        liriCommand.movie(term);
    } 
    // Run for user inputed movie
    else {
    console.log("Looking for movie info for " + term);
    var newTerm = arg.slice(3).join("+");
    // console.log(newTerm);
    liriCommand.movie(newTerm);
    };
}

// DO WHAT IT SAYS
else if (command === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', (error,data) =>{
        if (error) throw error;
        console.log(data);
        var content = data.split(" ");
        console.log(content);
        var txtCommand = content[0];
        var txtTerm = content.slice(1).join(" ");
        console.log(txtCommand, txtTerm);
        // Cases depending on command in txt file
        switch(txtCommand) {
            case "concert-this":
                liriCommand.concert(txtTerm);
                break;
            case "spotify-this-song":
                liriCommand.spotify(txtTerm);
                break;
            case "movie-this":
                var newTerm = txtTerm.slice(3).join("+");
                liriCommand.movie(newTerm);
                break;
        };
    });
};
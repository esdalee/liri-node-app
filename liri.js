// require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

// Import keys
var keys = require("./keys.js");

// Create new spotify object
// var spotify = new Spotify(keys.spotify);

// Initialize var for commands
var arg = process.argv;
var command = arg[2];
var term = arg.slice(3).join(" ");

// CONCERT
if (command === "concert-this") {
    var URL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp"
    axios.get(URL).then(function(response){
        var data = response.data[0];
        // console.log(data);
        var venueName = data.venue.name;
        var city = data.venue.city;
        var country = data.venue.country;
        var location = city + ", " + country;
        var date = moment(data.datetime).format('MM/DD/YYYY');
        console.log(date);
        var artistResult = "\nArtist: " + term + "\nVenue: " + venueName + "\nLocation: " + location + "\nDate: " + date + "\n\n";
        console.log(artistResult);
        fs.appendFile("log.txt", artistResult,function(error) {
            if (error) {
                console.log(error);
            }
        });
    }).catch(function(error){
    console.log(error);
    });
}

// SPOTIFY

else if (command === "spotify-this-song") {

};

// MOVIE

// do-what-it-says

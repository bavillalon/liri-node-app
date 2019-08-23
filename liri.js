//all of the requires for the app as well as including the spotify keys
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//function to get the concert info. this will ise the bootcamp api key. it will print the concert information to the console.
function getConcertInfo(artist) {
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function (response) {
        console.log("******************************");
        console.log(artist + " will be playing at...");
        console.log("******************************");
        for (var i = 0; i < response.data.length; i++) {
            let regionString = (response.data[i].venue.region === "") ? "" : (response.data[i].venue.region + ", ");
            console.log("   " + response.data[i].venue.name + " in " + response.data[i].venue.city + ", " + regionString + response.data[i].venue.country + " on " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            console.log("")
        };
        console.log("******************************");
    });
};

//function to spotify a song. tht spotify npm is called and then promised a response. the response is printed to screen. if there isn't a state associated with the city,
// then nothing will be printed fro teh state. if there is no preview of the song, then nothing will be printed for it either.
function getSpotifyInfo(song) {
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            console.log("******************************");
            console.log(`You searched for ${song}. This is what I found...`);
            console.log("******************************");
            for (var i = 0; i < response.tracks.items.length; i++) {
                var artistNamesArray = [];
                var artistNamesString;
                for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
                    artistNamesArray.push(response.tracks.items[i].artists[j].name);
                };
                artistNamesString = artistNamesArray.join(" and ");
                console.log()
                console.log("   " + response.tracks.items[i].name + " by " + artistNamesString + " on the album " + response.tracks.items[i].album.name);
                if (response.tracks.items[i].preview_url != null) {
                    console.log(response.tracks.items[i].preview_url);
                }
                console.log("")
            };
        })
        .catch(function (err) {
            console.log(err);
        });
    console.log("******************************");
};

//function to get the movie information. in the finction if no rating for the movie is found for IMDB or RT, then it will display NA for them. axios is used to get the omdb response.
function getMovie(movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function (response) {
        var IMDBRating = "NA";
        var RotttenTomatoesRating = "NA";
        console.log("******************************");
        console.log("You searched for" + movie + ". I found this...");
        console.log("******************************");
        for (let i = 0; i < response.data.Ratings.length; i++) {
            IMDBRating = response.data.Ratings[i].Source === "Internet Movie Database" ? response.data.Ratings[i].Value : IMDBRating;
            RotttenTomatoesRating = response.data.Ratings[i].Source === "Rotten Tomatoes" ? response.data.Ratings[i].Value : RotttenTomatoesRating;
        }
        console.log(`
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB: ${IMDBRating}
        Rotten Tomatoes: ${RotttenTomatoesRating}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
        `);
        console.log("******************************");
    });
};

//function to get the command from a text file and do what it says. it will call the LIRI function. 
// there is a catch to make sure it doesn't end up in a recursive loop.
function justDoIt() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("******************************");
        console.log("The file random.txt says: " + data);
        console.log("******************************");
        console.log(" ")
        var dataArr = data.split(",");
        if (dataArr[0] === "do-what-it-says") {
            console.log("I am already doing what it ways.");
        }
        else {
            LIRI(dataArr[0], dataArr[1]);
        };
    });
};


//grabing the user command and query and join the queyr with a space between words
const userCommand = process.argv[2];
const userQuery = process.argv.slice(3).join(" ");

//LIRI app. all of the commands will be in a switch statement.
function LIRI(command, query) {
    switch (command) {
        case "concert-this":
            getConcertInfo(query);
            return
        case "spotify-this-song":
            getSpotifyInfo(query === "" ? "The Sign" : query);
            return
        case "movie-this":
            getMovie(query === "" ? "Mr Nobody" : query);
            return
        case "do-what-it-says":
            justDoIt();
            return
    };
};

//final call of the LIRI app.
LIRI(userCommand, userQuery);

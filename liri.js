require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

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

function getSpotifyInfo(song) {
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            console.log("******************************");
            console.log(`You searched for ${song}. This is what I found...`);
            console.log("******************************");
            for (var i = 0; i < response.tracks.items.length; i++) {
                var artistNamesArray=[];
                var artistNamesString;
                for (var j=0; j<response.tracks.items[i].artists.length;j++){
                    artistNamesArray.push(response.tracks.items[i].artists[j].name);
                };
                artistNamesString=artistNamesArray.join(" and ");
                console.log()
                console.log("   " + response.tracks.items[i].name + " by " + artistNamesString + " on the album " + response.tracks.items[i].album.name);
                if ( response.tracks.items[i].preview_url!=null){
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

function getMovie(movie){
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function(response){
        var IMDBRating="NA";
        var RotttenTomatoesRating="NA";
        console.log("******************************");
        console.log("You searched for" + movie+ ". I found this...");
        console.log("******************************");
        for(let i=0;i<response.data.Ratings.length;i++){
            IMDBRating=response.data.Ratings[i].Source==="Internet Movie Database"?response.data.Ratings[i].Value:IMDBRating;
            RotttenTomatoesRating=response.data.Ratings[i].Source==="Rotten Tomatoes"?response.data.Ratings[i].Value:RotttenTomatoesRating;
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

function justDoIt(){
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        console.log("******************************");
        console.log("The file random.txt says: " + data);
        console.log("******************************");
        console.log(" ")
        var dataArr = data.split(",");
        if(dataArr[0]==="do-what-it-says"){
            console.log("I am already doing what it ways.");
        }
        else{
            LIRI(dataArr[0],dataArr[1]);
        };


      });
};

  

const userCommand = process.argv[2];
const userQuery = process.argv.slice(3).join(" ");

function LIRI(command,query){
switch (command) {
    case "concert-this":
        getConcertInfo(query);
        return
    case "spotify-this-song":
        getSpotifyInfo(query===""?"The Sign":query);
        return
    case "movie-this":
        getMovie(query===""?"Mr Nobody":query);
        return
    case "do-what-it-says":
        justDoIt();
        return
};
};
LIRI(userCommand,userQuery);

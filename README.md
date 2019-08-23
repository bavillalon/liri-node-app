# liri-node-app

A link to the working app is here: https://drive.google.com/file/d/1-EriWi7gIfVfyxEd03Tbg7z0JlMmLxaZ/view

the purpose of the app is to allow a user to type in a command for one of three entertainment based apis and recieve the recpose in a user readable format.
the entertainment apis are bands in town for concerts, spotify for songs, omdb for movies. 

axios is the package used to get the movie and concert information and there is a spotify package available as an npm that we used for that api.

fs, moment, dotenv, are used to support other functions such as file reading, date formating, and reading of API keys.

To use the app, type one of the commands below:
`node liri.js concert-this *artist to search for*`
`node liri.js spotify-this-song *song to search for*`
`node liri.js movie-this *movie to search for*`
`node liri.js do-what-it-says *opens a file and excecutes the command in there*`


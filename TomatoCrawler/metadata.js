const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low('metadata_db.json', { storage });
db._.mixin(require('underscore-db'))
var request = require('request');
var _ = require('lodash');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(5, 'second');

const tomatoDb = low('tomato_db.json', {storage});

const collectedMovies = db('metadata')
  .chain()
  .map(it => it.url_id)
  .value();

const collectedMoviesSet = new Set(collectedMovies);

const movieNames = tomatoDb('reviews')
  .chain()
  .map(it => it.movie)
  .uniq()
  .remove(it => !collectedMoviesSet.has(it))
  .value();

// console.log(movieNames);

function getMetadata(movieName, alternateId) {
  const name = encodeURIComponent(movieName.split('_').join(' '));
  const apiKey = 'x2qpqmeu3kx3k8rj5zghjs2a';
  const url = `http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=${apiKey}&q=${name}&page_limit=1`;
  request.get({
    url: url,
    json: true
  }, (e, r, body) => {
    if (!e && r.statusCode == 200) {
      const movie = body.movies[0];
      if (movie) {
        movie.url_id = alternateId ? alternateId : movieName;
        db('metadata').push(movie);
        console.log(`Done for movie ${movieName}`);
      } else {
        console.error(`No result for movie ${movieName}`);
      }
    } else {
      console.error(`Failed for movie ${movieName}`);
    }
  })
}

function makeRequest(movieName, alternateId) {
  limiter.removeTokens(1, function(err, remainingRequests) {
    getMetadata(movieName, alternateId);
  });
}

console.log(`Number of movies left to crawl: ${movieNames.length}`);

const manualNames = [
  ['20,000 days on earth', '20000_days_on_earth'],
  ['the wrecking crew', '1200743-wrecking_crew'],
  ['leviathan', 'leviafan']
];

_.chain(movieNames)
.forEach(it => makeRequest(it))
.value();

_.chain(manualNames)
.remove(it => !collectedMoviesSet.has(it[1]))
.forEach(it => makeRequest(it[0], it[1]))
.value();

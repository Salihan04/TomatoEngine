const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low('metadata_db.json', { storage });
db._.mixin(require('underscore-db'))
var request = require('request');
var _ = require('lodash');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(5, 'second');

const tomatoDb = low('tomato_db.json', {storage});

// const collectedMovies = db('metadata')
//   .chain()
//   .map(it => it.url_id)
//   .value();
//
// const collectedMoviesSet = new Set(collectedMovies);
//
// const movieNames = tomatoDb('reviews')
//   .chain()
//   .map(it => it.movie)
//   .uniq()
//   .filter(it => !collectedMoviesSet.has(it))
//   .value();
//
// console.log(movieNames.length);
//
// // console.log(movieNames);
//
// function getTomatoMetadata(movieName, alternateId) {
//   const name = encodeURIComponent(movieName.split('_').join(' '));
//   const apiKey = 'x2qpqmeu3kx3k8rj5zghjs2a';
//   const url = `http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=${apiKey}&q=${name}&page_limit=1`;
//   request.get({
//     url: url,
//     json: true
//   }, (e, r, body) => {
//     if (!e && r.statusCode == 200) {
//       const movie = body.movies[0];
//       if (movie) {
//         movie.url_id = alternateId ? alternateId : movieName;
//         db('metadata').push(movie);
//         console.log(`Done for movie ${movieName}`);
//       } else {
//         console.error(`No result for movie ${movieName}`);
//       }
//     } else {
//       console.error(`Failed for movie ${movieName}`);
//     }
//   })
// }
//
// function makeTomatoRequest(movieName, alternateId) {
//   limiter.removeTokens(1, function(err, remainingRequests) {
//     getTomatoMetadata(movieName, alternateId);
//   });
// }
//
// console.log(`Number of movies left to crawl: ${movieNames.length}`);
//
// const manualNames = [
//   ['20,000 days on earth', '20000_days_on_earth'],
//   ['the wrecking crew', '1200743-wrecking_crew'],
//   ['leviathan', 'leviafan']
// ];
//
// _.chain(movieNames)
// .forEach(it => makeTomatoRequest(it))
// .value();
//
// _.chain(manualNames)
// .remove(it => !collectedMoviesSet.has(it[1]))
// .forEach(it => makeTomatoRequest(it[0], it[1]))
// .value();

function getImdbRequest(movieId, movie) {
  const url = `http://www.omdbapi.com/?i=${movieId}&plot=short&r=json`;
  request.get({
    url: url,
    json: true
  }, (e, r, body) => {
    if (!e && r.statusCode == 200) {
      if (body) {
        db('imdb').push({id: movie.id});
        db('metadata').updateById(movie.id, {imdb: body})
        console.log(`Done for movie ${movie.title}`);
      } else {
        console.error(`No result for movie ${movie.title}`);
      }
    } else {
      console.error(`Failed for movie ${movie.title}`);
    }
  })
}

function makeImdbRequest(movieId, movie) {
  limiter.removeTokens(1, function(err, remainingRequests) {
    getImdbRequest(movieId, movie);
  });
}

const missingImdbIds = db('metadata')
  .chain()
  .filter(it => !_.has(it.alternate_ids, 'imdb'))
  .map(it => it.url_id)
  .value();

const manualImdbTitles = db('metadata')
  .chain()
  .filter(it => _.includes(missingImdbIds, it.url_id))
  .forEach(it => {
    const title = encodeURIComponent(it.title);
    const url = `http://www.omdbapi.com/?t=${title}&y=&plot=short&r=json`;
    request.get({
      url: url,
      json: true
    }, (e, r, body) => {
      if (!e && r.statusCode == 200) {
        if (body) {
          db('metadata').updateById(it.id, {alternate_ids: {imdb: body.imdbID.substring(2)}})
          console.log(db('metadata').getById(it.id));
          console.log(`Added IMDB id ${body.imdbID} for ${it.title}`);
        } else {
          console.error(`No result for movie ${it}`);
        }
      } else {
        console.error(`Failed for movie ${it}`);
      }
    });
  })
  .value();

console.log(missingImdbIds);

const tomatoMovieIds = db('metadata')
  .chain()
  .filter(it => !_.has(it, 'imdb'))
  .map(it => [`tt${it.alternate_ids.imdb}`, it])
  .value();

console.log(`Number of IMDB data left to crawl: ${tomatoMovieIds.length}`);

_.chain(tomatoMovieIds)
  .forEach(it => makeImdbRequest(it[0], it[1]))
  .value();

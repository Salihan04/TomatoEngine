const util = require('util');
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('tomato_db.json', { storage })
var uuid = require('node-uuid');
var Xray = require('x-ray');

function downloadMovieReview(movie_name) {
  var x = Xray();
  x(util.format('http://www.rottentomatoes.com/m/%s/reviews/?type=user', movie_name),
    '.review_table_row',
    [
      {
        reviewer: x('.articleLink', '@html'),
        reviewer_url: x('.articleLink', '@href'),
        review: x('.review_table_row', '.user_review'),
        rating: x('.scoreWrapper', 'span@class'),
        date: x('.subtle', '@html')
      }
    ])
    .paginate('.btn-primary-rt[href]:last-child@href')
    .write("data/" + movie_name + ".json");
}

var xray = Xray();
xray('http://www.rottentomatoes.com/top/bestofrt/?year=2014',
  'table',
  ['.articleLink@href']
)(function(error, links) {

  for(var i=0; i<links.length; i++) {
    var link = links[i];
    link = link.replace('http://www.rottentomatoes.com/m/', '');
    link = link.replace('/', '');
    downloadMovieReview(link);
  }

})

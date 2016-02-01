const util = require('util');
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('tomato_db.json', { storage })
var forEach = require('async-foreach').forEach;
var uuid = require('node-uuid');
var Xray = require('x-ray');
var request = require('sync-request');
var cheerio = require('cheerio')

function extractMovieReviews(url) {
  var x = Xray();
  var res = request('GET', url);

  x(res.getBody(),
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
xray('http://www.rottentomatoes.com/top/bestofrt/?year=2015',
  'table',
  ['.articleLink@href']
)(function(error, links) {

  forEach(links, function(link, index, links) {
      var movie_name = link.replace('http://www.rottentomatoes.com/m/', '');
      movie_name = movie_name.replace('/', '');

      link = util.format('http://www.rottentomatoes.com/m/%s/reviews/?type=user', movie_name);
      console.log("[STARTED] " + link);

      while(true) {
        var res = request('GET', link);

        while(res.statusCode !== 200) {
          res = request('GET', link);
          console.log("[RETRY] " + link);
        }

        var $ = cheerio.load(res.getBody('utf-8'));

        // Pagination
        nextPage = $('.btn-primary-rt[href]').last().attr('href');
        if(!nextPage || nextPage == '#') {
          break;
        }

        var x = Xray();
        x($('.review_table').html(),
          '.review_table_row',
          [
            {
              reviewer: x('.articleLink', '@html'),
              reviewer_url: x('.articleLink', '@href'),
              review: x('.review_table_row', '.user_review'),
              rating: x('.scoreWrapper', 'span@class'),
              date: x('.subtle', '@html')
            }
          ])(function(error, reviews) {
            if(reviews) {
              for(var i=0; i<reviews.length; i++) {
                var review = reviews[i];
                review['id'] = uuid.v4();
                review['movie'] = movie_name;

                db('reviews').push(review);
              }
            }
          });

        console.log("[DONE] " + link);

        nextPage = 'http://www.rottentomatoes.com' + nextPage;
        link = nextPage;
      }
  });

})

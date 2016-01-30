const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('tomato_db.json', { storage })
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

var jsonFiles = fs.readdirSync("data");
for(var i=0; i<jsonFiles.length; i++) {
  var jsonFile = jsonFiles[i];

  if(path.extname(jsonFile) === '.json') {
    var reviews = fs.readFileSync("data/" + jsonFile, 'utf8');
    reviews = reviews.replace(',]', ']');
    reviews = "{ \"reviews\" : " + reviews + "}";
    reviews = JSON.parse(reviews)["reviews"];

    for(var j=0; j<jsonFiles.length; j++) {
      var review = reviews[j];
      review["id"] = uuid.v4();
      review["movie"] = jsonFile.replace('.json', '');

      db("reviews").push(review);
    }
  }
}

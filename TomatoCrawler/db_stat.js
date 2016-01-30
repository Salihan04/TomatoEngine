const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('tomato_db.json', { storage })

console.log("Total reviews: " + db("reviews").size());

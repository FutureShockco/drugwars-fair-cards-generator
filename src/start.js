random = require('./random.js')
const steemStreamer = require('./steemStreamer.js')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://localhost:27017'
const mongoDbName = 'fairgen'
db = null

random.init(function() {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(err, client) {
        if (err) throw err
        console.log("Connected successfully to database")
        db = client.db(mongoDbName)
        steemStreamer.start(db)
    })
})

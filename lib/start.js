'use strict';

random = require('./random.js');
var steemStreamer = require('./steemStreamer.js');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017';
var mongoDbName = 'fairgen';
db = null;

random.init(function () {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, client) {
        if (err) throw err;
        console.log("Connected successfully to database");
        db = client.db(mongoDbName);
        steemStreamer.start(db);
    });
});
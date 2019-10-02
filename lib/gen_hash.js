'use strict';

var fs = require('fs');
var sha512 = require('hash.js/lib/hash/sha/512');

var seed = process.env.SEED || 'default seed here';
var rnCount = process.env.COUNT || 100;
var filename = 'hashes.txt';

var hash = sha512().update(seed).digest('hex');
var list = [hash];
while (list.length < rnCount) {
    if (list.length % 1000 === 0) console.log(list.length);
    hash = sha512().update(list[list.length - 1]).digest('hex');
    list.push(hash);
}

fs.writeFile(filename, list.join('\n'), function (err) {
    if (err) return console.log(err);
    console.log(rnCount + " hashes saved to " + filename);
});
'use strict';

var fs = require('fs');
var bigInt = require('big-integer');
var sha512 = require('hash.js/lib/hash/sha/512');
var path_hash = './src/hashes.txt';
var path_hash_public = './src/hashes_public.txt';

var random = {
    init: function init(cb) {
        fs.readFile(path_hash_public, 'utf-8', function read(err, data) {
            if (err) throw err;
            random.serverCount = data.split('\n').length - 1;
            cb();
        });
    },
    serverCount: 0,
    serverSeed: function serverSeed(cb) {
        fs.readFile(path_hash, 'utf-8', function read(err, data) {
            if (err) throw err;

            var hashes = data.split('\n');
            var next = hashes.length - random.serverCount - 1;
            console.log(next + ' hashes remaining');
            random.serverCount++;

            if (!hashes[next]) throw 'End of hashes list';

            fs.appendFile(path_hash_public, hashes[next] + '\n', function (err) {
                if (err) throw err;
                cb(hashes[next]);
            });
        });
    },
    transactionSeed: function transactionSeed(block, tx) {
        return sha512().update(block.transaction_merkle_root + tx.transaction_id).digest('hex');
    },
    seed: function seed(block, tx, cb) {
        random.serverSeed(function (serverSeed) {
            var txSeed = random.transactionSeed(block, tx);
            var finalSeed = sha512().update(serverSeed + txSeed).digest('hex');
            cb(finalSeed);
        });
    },
    checkseed: function checkseed(block, tx, serverSeed, cb) {
        var txSeed = random.transactionSeed(block, tx);
        var finalSeed = sha512().update(serverSeed + txSeed).digest('hex');
        return cb(finalSeed);
    },
    next: function next(seed) {
        return sha512().update(seed).digest('hex');
    },
    number: function number(seed, interval) {
        var result = bigInt(seed, 16);
        //console.log(result)
        if (!interval) return result;
        if (interval) {
            var range = interval.max - interval.min;
            var granularity = range;
            if (interval.precision != 0) granularity *= Math.pow(10, interval.precision);
            var random = Number(result.mod(granularity).value);
            if (interval.precision != 0) random /= Math.pow(10, interval.precision);
            if (!random) console.log('ERROR', random, range, granularity);
            return random;
        }
    }
};

module.exports = random;
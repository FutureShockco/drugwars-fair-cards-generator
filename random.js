const fs = require('fs')
const bigInt = require('big-integer')
const sha512 = require('hash.js/lib/hash/sha/512')
const path_hash = 'hashes.txt'
const path_hash_public = 'hashes_public.txt'

var random = {
    init: function(cb) {
        fs.readFile(path_hash_public, 'utf-8', function read(err, data) {
            if (err) throw err
            random.serverCount = data.split('\n').length-1
            cb()
        });
    },
    serverCount: 0,
    serverSeed: function(cb) {
        fs.readFile(path_hash, 'utf-8', function read(err, data) {
            if (err) throw err
            
            var hashes = data.split('\n')
            var next = hashes.length - random.serverCount - 1
            console.log(next+' hashes remaining')
            random.serverCount++

            if (!hashes[next]) throw 'End of hashes list'

            fs.appendFile(path_hash_public, hashes[next]+'\n', function (err) {
                if (err) throw err
                cb(hashes[next])
            })
        });
    },
    transactionSeed: function(block, tx) {
        return sha512().update(block.transaction_merkle_root+tx.transaction_id).digest('hex')
    },
    seed: function(block, tx, cb) {
        random.serverSeed(function(serverSeed) {
            var txSeed = random.transactionSeed(block, tx)
            var finalSeed = sha512().update(serverSeed+txSeed).digest('hex')
            cb(finalSeed)
        })
    },
    next: function(seed) {
        return sha512().update(seed).digest('hex')
    },
    number: function(seed, interval) {
        var result = bigInt(seed, 16)
        //console.log(result)
        if (!interval) return result
        if (interval) {
            var range = interval.max - interval.min
            var granularity = range
            if (interval.precision != 0)
                granularity *= Math.pow(10, interval.precision)
            var random = result.mod(granularity).value
            if (interval.precision != 0)
                random /= Math.pow(10, interval.precision)
            if (!random)
                console.log('ERROR', random, range, granularity)
            return random
        }
    }
}

module.exports = random
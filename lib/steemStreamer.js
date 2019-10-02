'use strict';

var steem = require('steem');
var card = require('./card_generator.js');
var start_block = 36683168;

var streamer = {
    db: null,
    lirb: 0,
    start: function start(db) {
        streamer.db = db;

        setInterval(function () {
            steem.api.getDynamicGlobalProperties(function (err, props) {
                streamer.lirb = parseInt(props.last_irreversible_block_num);
                //console.log('LIRB: '+streamer.lirb)
            });
        }, 3000);

        steem.api.getDynamicGlobalProperties(function (err, props) {
            streamer.lirb = parseInt(props.last_irreversible_block_num);
            streamer.db.collection('last_steem_block').findOne({}, function (err, block) {
                if (err) throw err;
                if (!block) {
                    block = {
                        height: start_block
                    };
                    streamer.db.collection('last_steem_block').insertOne(block);
                }
                //console.log(`Last loaded block was ${block.height}`);
                var nextBlockNum = block.height + 1;
                streamer.handleBlock(nextBlockNum);
            });
        });
    },
    handleBlock: function handleBlock(blockNum) {
        if (streamer.lirb >= blockNum) {
            steem.api.getBlock(blockNum, function (err, block) {
                if (err) {
                    console.error('Request \'getBlock\' failed at block num: ' + blockNum + ', retry', err);
                    streamer.handleBlock(blockNum);
                    return;
                }
                streamer.work(block, function () {
                    streamer.db.collection('last_steem_block').replaceOne({ height: blockNum - 1 }, { $set: {
                            height: blockNum,
                            timestamp: block.timestamp
                        } }, function (err) {
                        if (err) {
                            console.error("Failed to set 'block_height' on MongoDB", err);
                            streamer.handleBlock(blockNum);
                            return;
                        }
                        if (blockNum % 100 == 0) console.log('New block height is ' + blockNum + ' ' + block.timestamp);
                        streamer.handleBlock(blockNum + 1);
                    });
                });
            });
        } else {
            setTimeout(function () {
                streamer.handleBlock(blockNum);
            }, 100);
        }
    },
    work: function work(block, cb) {
        var txs = block.transactions;
        for (var i = 0; i < txs.length; i++) {
            var tx = txs[i];
            for (var y = 0; y < tx.operations.length; y++) {
                var op = tx.operations[y];
                if (op[0] === 'transfer'
                // && op[1].to === 'drugwars'
                && op[1].memo) {
                    //console.log('Received '+op[1].amount+' from '+op[1].from+' '+op[1].memo)
                    random.seed(block, tx, function (seed) {
                        card.forge(seed);
                    });
                }
            }
        }
        cb();
    }
};

module.exports = streamer;
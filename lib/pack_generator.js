'use strict';

var card = require('./card_generator.js');
var random = require('./random.js');
var seedsPerCard = 30;
var cardsPerPack = 5;

var pack = {
    forge: function forge(seed) {
        var neededSeeds = cardsPerPack * seedsPerCard;

        var seeds = [seed];
        while (seeds.length < neededSeeds) {
            seeds.push(random.next(seeds[seeds.length - 1]));
        }var cards = [];
        cards.push(card.forge(seeds.splice(0, seedsPerCard), 4));
        while (cards.length < cardsPerPack) {
            cards.push(card.forge(seeds.splice(0, seedsPerCard)));
        }console.log(cards);
        return cards;
    }
};

module.exports = pack;
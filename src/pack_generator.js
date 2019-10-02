const card = require('./card_generator.js')
const random = require('./random.js')
const seedsPerCard = 30
const cardsPerPack = 5

var pack = {
    forge: function(seed) {
        var neededSeeds = cardsPerPack * seedsPerCard

        var seeds = [seed]
        while (seeds.length < neededSeeds)
            seeds.push(random.next(seeds[seeds.length - 1]))

        var cards = []
        cards.push(card.forge(seeds.splice(0, seedsPerCard), 4))
        while (cards.length < cardsPerPack)
            cards.push(card.forge(seeds.splice(0, seedsPerCard)))

        console.log(cards)
        return cards
    }
}

module.exports = pack

    // au moins une carte de telle qualité
    // environ 5 cartes
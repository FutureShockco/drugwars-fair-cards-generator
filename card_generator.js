// CARD

const distributions = require('distributions')
const heroes = require('./lib/drugwars/heroes.json')
const maxSeeds = 20

var card = {
    forge: function(seed) {
        var newCard = {}
        var seeds = [seed]
        while (seeds.length < maxSeeds)
            seeds.push(random.next(seeds[seeds.length-1]))
        
        newCard.quality = card.quality(seeds.splice(0,1))
        newCard.family = card.family(seeds.splice(0,1))
        newCard.hero = card.hero(seeds.splice(0,1), newCard.family)

        var bonus = card.bonusByQuality(newCard.quality)

        newCard.attack = card.normal(seeds.splice(0,1), bonus[0], bonus[1])
        newCard.health = card.normal(seeds.splice(0,1), bonus[0], bonus[1], 1)
        newCard.carry = card.normal(seeds.splice(0,1), bonus[0], bonus[1])
        newCard.speed = card.normal(seeds.splice(0,1), bonus[0], bonus[1])

        var resTotal = bonus[0]
        newCard.res_physical = card.uniform(seeds.splice(0,1), 0, 100)
        newCard.res_weapon = card.uniform(seeds.splice(0,1), 0, 100)
        newCard.res_fire = card.uniform(seeds.splice(0,1), 0, 100)
        newCard.res_chemical = card.uniform(seeds.splice(0,1), 0, 100)
        var newTotal = newCard.res_physical + newCard.res_weapon + newCard.res_fire + newCard.res_chemical
        var ratio = newTotal / resTotal
        newCard.res_physical /= ratio
        newCard.res_weapon /= ratio
        newCard.res_fire /= ratio
        newCard.res_chemical /= ratio

        newCard.active_skills = [

        ]
        newCard.passive_skills = [

        ]

        newCard.durability = card.uniform(seeds.splice(0,1), 90, 100)
        newCard.degrability = card.normal(seeds.splice(0,1), 50, 10)

        // newCard.attackType = ...
        // newCard.prefix = ...
        // newCard.suffix = ...
        console.log(newCard)
        return newCard
    },
    quality: function(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        // todo
        if (rn > 99999)
            return 'godly'
        if (rn > 95000)
            return 'legendary'
        if (rn > 80000)
            return 'rare'
        return 'common'
    },
    bonusByQuality: function(quality) {
        if (quality == 'common') return [40,13]
        if (quality == 'rare') return [50, 12]
        if (quality == 'legendary') return [60, 11]
        if (quality == 'godly') return [70,10]
    },
    family: function(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        // todo
        if (rn > 99999)
            return 'cops'
        if (rn > 95000)
            return 'cartel'
        if (rn > 80000)
            return 'mafia'
        return 'gang'
    },
    hero: function(seed, family) {
        var availHeroes = heroes[family]
        var randomIndex = random.number(seed).mod(availHeroes.length)
        return availHeroes[randomIndex]
    },
    normal: function(seed, mean, stdDev, half) {
        var dist = distributions.Normal(mean, stdDev)
        var rn = random.number(seed, {
            min: 0,
            max: 10000,
            precision: 2
        })
        rn /= 10000
        // https://upload.wikimedia.org/wikipedia/commons/9/9b/Probit_plot.png
        var normal = dist.inv(rn)
        if (half == 1 && normal < mean)
            normal = 2*mean-normal
        if (half == -1 && normal > mean)
            normal = 2*mean-normal
        return normal
    },
    uniform: function(seed, min, max) {
        var dist = distributions.Uniform(min, max)
        var rn = random.number(seed, {
            min: 0,
            max: 10000,
            precision: 2
        })
        rn /= 10000
        return dist.inv(rn)
    }
}

module.exports = card
// CARD

const distributions = require('distributions')
const random = require('./random.js') 
const { Cards } = require('drugwars')
const maxSeeds = 30
const heroes = require('./heroes.json');
const passives = require('./passives.json');

const physical = require('./skill_physical.json');
const weapon = require('./skill_weapon.json');
const fire = require('./skill_fire.json');
const chemical = require('./skill_chemical.json');

const actives = {physical,weapon,fire,chemical}

var card = {     
    forge: function (seeds, forceQuality) {
        var newCard = {}
        if (!Array.isArray(seeds)) {
            seeds = [seeds]
            while (seeds.length < maxSeeds)
                seeds.push(random.next(seeds[seeds.length - 1]))
        }

        newCard.type = card.type(seeds.splice(0, 1))
        if (forceQuality) {
            newCard.quality = card.quality(seeds.splice(0, 1))
            if (newCard.quality < 5) {
                newCard.quality ++
            }
        } else
            newCard.quality = card.quality(seeds.splice(0, 1))

        switch (newCard.type) {
            // case 'item':
            //     newCard = this.createItemCard(newCard, seeds)
            //     break;
            case 'hero':
                newCard = this.createHeroCard(newCard, seeds)
                break;

            default:
                newCard = this.createHeroCard(newCard, seeds)
                break;
        }
        newCard.durability = card.uniform(seeds.splice(0, 1), 90, 100)
        newCard.degrability = card.normal(seeds.splice(0, 1), 50, 10)
        newCard.id = this.generateUUID()

        return newCard
    },
    generateUUID: function () {
        var d = new Date().getTime();
        var d2 = 0;
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                var r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                var r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    },
    createHeroCard: function (newCard, seeds) {
        newCard.family = card.family(seeds.splice(0, 1))
        newCard.hero = card.hero(seeds.splice(0, 1), newCard.family)
        newCard.attack_type = card.attack_type(seeds.splice(0, 1))

        newCard.active_skills = card.active_skill(seeds.splice(0, 1),seeds.splice(0, 1),newCard.quality, newCard.attack_type)
        
        newCard.passive_skills = card.passive_skill(seeds.splice(0, 1),seeds.splice(0, 1),newCard.quality, newCard.family)
        

        var bonus = card.bonusByQuality(newCard.quality)
        newCard.attack = card.normal(seeds.splice(0, 1), bonus[0], bonus[1])
        newCard.health = card.normal(seeds.splice(0, 1), bonus[0], bonus[1], 1)
        newCard.carry = card.normal(seeds.splice(0, 1), bonus[0], bonus[1])
        newCard.speed = card.normal(seeds.splice(0, 1), bonus[0], bonus[1])

        var resTotal = bonus[0]
        newCard.res_physical = card.uniform(seeds.splice(0, 1), 0, 100)
        newCard.res_weapon = card.uniform(seeds.splice(0, 1), 0, 100)
        newCard.res_fire = card.uniform(seeds.splice(0, 1), 0, 100)
        newCard.res_chemical = card.uniform(seeds.splice(0, 1), 0, 100)
        var newTotal = newCard.res_physical + newCard.res_weapon + newCard.res_fire + newCard.res_chemical
        var ratio = newTotal / resTotal
        newCard.res_physical = Math.round(newCard.res_physical / ratio)
        newCard.res_weapon = Math.round(newCard.res_weapon / ratio)
        newCard.res_fire = Math.round(newCard.res_fire / ratio)
        newCard.res_chemical = Math.round(newCard.res_chemical / ratio)


        return newCard
    },
    type: function (seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        // if (rn > 99000)
        //     return 'building'
        // if (rn > 96000)
        //     return 'unit'
        // if (rn > 90000)
        //     return 'item'
        return 'hero'
    },
    quality: function (seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        if (rn > 99500)
            return 5
        if (rn > 97000)
            return 4
        if (rn > 88000)
            return 3
        if (rn > 87000)
            return 2
        return 1
    },
    attack_type: function (seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        // todo
        if (rn > 80000) {
            return 'chemical'
        }
        if (rn > 60000) {
            return 'fire'
        }
        if (rn > 40000) {
            return 'weapon'
        }
        return 'physical'
    },
    bonusByQuality: function (quality) {
        if (quality == 5) return [80, 10]
        if (quality == 4) return [70, 10]
        if (quality == 3) return [60, 11]
        if (quality == 2) return [50, 12]
        if (quality == 1) return [40, 13]
    },
    family: function (seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        })
        // todo
        if (rn > 99990)
            return 'cops'
        if (rn > 70000)
            return 'bosses'

        return 'heroes'
    },
    hero: function (seed, family) {
        var availHeroes = heroes[family]
        var randomIndex = random.number(seed).mod(availHeroes.length)
        return availHeroes[randomIndex].name
    },
    active_skill: function (skill_seed, modifier_seed, quality, attack_type) {
        var availActives = actives[attack_type]
        var randomIndex = random.number(skill_seed).mod(availActives.length)
        var skill = {}
        skill.id = availActives[randomIndex].id
        skill.values = []
        var values = availActives[randomIndex].suffixes[quality-1].values
        values.forEach(element => {
            skill.values.push(card.uniform(modifier_seed, 1, element+1))
        });
        return skill
    },
    passive_skill: function (skill_seed, modifier_seed, quality, family) {
        var availPassives = passives
        var randomIndex = random.number(skill_seed).mod(availPassives.length)
        var skill = {}
        skill.id = availPassives[randomIndex].id
        skill.values = []
        var values = availPassives[randomIndex].suffixes[quality-1].values
        values.forEach(element => {
            skill.values.push(card.uniform(modifier_seed, 1, element+1))
        });
        return skill
    },
    normal: function (seed, mean, stdDev, half) {
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
            normal = 2 * mean - normal
        if (half == -1 && normal > mean)
            normal = 2 * mean - normal
        return Math.round(normal)
    },
    uniform: function (seed, min, max) {
        var dist = distributions.Uniform(min, max)
        var rn = random.number(seed, {
            min: 0,
            max: 10000,
            precision: 2
        })
        rn /= 10000
        return Math.round(dist.inv(rn))
    }
}

module.exports = card
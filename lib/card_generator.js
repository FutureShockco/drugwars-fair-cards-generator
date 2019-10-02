'use strict';

// CARD

var distributions = require('distributions');
var random = require('./random.js');

var _require = require('drugwars'),
    Cards = _require.Cards;

var maxSeeds = 30;

var card = {
    forge: function forge(seeds, quality) {
        var newCard = {};
        newCard.id = seeds;
        if (!Array.isArray(seeds)) {
            seeds = [seeds];
            while (seeds.length < maxSeeds) {
                seeds.push(random.next(seeds[seeds.length - 1]));
            }
        }

        newCard.type = card.type(seeds.splice(0, 1));
        if (quality) {
            newCard.quality = quality;
            seeds.splice(0, 1);
        } else newCard.quality = card.quality(seeds.splice(0, 1));

        switch (newCard.type) {
            case 'building':

                break;
            case 'unit':

                break;
            case 'item':

                break;
            case 'hero':
                newCard.family = card.family(seeds.splice(0, 1));
                newCard.hero = card.hero(seeds.splice(0, 1), newCard.family);
                newCard.attack_type = card.attack_type(seeds.splice(0, 1));

                newCard.prefixe = card.prefixe(seeds.splice(0, 1), newCard.family, newCard.quality);
                newCard.suffixe = card.suffixe(seeds.splice(0, 1), newCard.attack_type, newCard.quality);

                var bonus = card.bonusByQuality(newCard.quality);
                newCard.attack = card.normal(seeds.splice(0, 1), bonus[0], bonus[1]);
                newCard.health = card.normal(seeds.splice(0, 1), bonus[0], bonus[1], 1);
                newCard.carry = card.normal(seeds.splice(0, 1), bonus[0], bonus[1]);
                newCard.speed = card.normal(seeds.splice(0, 1), bonus[0], bonus[1]);

                var resTotal = bonus[0];
                newCard.res_physical = card.uniform(seeds.splice(0, 1), 0, 100);
                newCard.res_weapon = card.uniform(seeds.splice(0, 1), 0, 100);
                newCard.res_fire = card.uniform(seeds.splice(0, 1), 0, 100);
                newCard.res_chemical = card.uniform(seeds.splice(0, 1), 0, 100);
                var newTotal = newCard.res_physical + newCard.res_weapon + newCard.res_fire + newCard.res_chemical;
                var ratio = newTotal / resTotal;
                newCard.res_physical = Math.round(newCard.res_physical / ratio);
                newCard.res_weapon = Math.round(newCard.res_weapon / ratio);
                newCard.res_fire = Math.round(newCard.res_fire / ratio);
                newCard.res_chemical = Math.round(newCard.res_chemical / ratio);

                newCard.active_skills = [card.active_skill(seeds.splice(0, 1), newCard.family, newCard.attack_type)];
                newCard.passive_skills = [card.passive_skill(seeds.splice(0, 1), newCard.family)];
                break;

            default:
                break;
        }

        newCard.durability = card.uniform(seeds.splice(0, 1), 90, 100);
        newCard.degrability = card.normal(seeds.splice(0, 1), 50, 10);

        return newCard;
    },
    type: function type(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        });
        if (rn > 99999) return 'building';
        if (rn > 95000) return 'unit';
        if (rn > 90000) return 'item';
        return 'hero';
    },
    quality: function quality(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        });
        // todo
        if (rn > 99999) return 1;
        if (rn > 95000) return 2;
        if (rn > 80000) return 3;
        if (rn > 70000) return 4;
        return 5;
    },
    attack_type: function attack_type(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        });
        // todo
        if (rn > 80000) {
            return 'chemical';
        }
        if (rn > 60000) {
            return 'fire';
        }
        if (rn > 40000) {
            return 'weapon';
        }
        return 'physical';
    },
    bonusByQuality: function bonusByQuality(quality) {
        if (quality == 1) return [80, 10];
        if (quality == 2) return [70, 10];
        if (quality == 3) return [60, 11];
        if (quality == 4) return [50, 12];
        if (quality == 5) return [40, 13];
    },
    family: function family(seed) {
        var rn = random.number(seed, {
            min: 0,
            max: 100000,
            precision: 0
        });
        // todo
        if (rn > 99999) return 'cops';
        if (rn > 95000) return 'cartel';
        if (rn > 80000) return 'mafia';
        return 'gang';
    },
    hero: function hero(seed, family) {
        var availHeroes = Cards.heroes[family];
        var randomIndex = random.number(seed).mod(availHeroes.length);
        return availHeroes[randomIndex];
    },
    prefixe: function prefixe(seed, family, quality) {
        var availPrefixes = Cards.prefixes[family][quality];
        var randomIndex = random.number(seed).mod(availPrefixes.length);
        return availPrefixes[randomIndex];
    },
    suffixe: function suffixe(seed, attack_type, quality) {
        var availSuffixes = Cards.suffixes[attack_type][quality];
        var randomIndex = random.number(seed).mod(availSuffixes.length);
        return availSuffixes[randomIndex];
    },
    active_skill: function active_skill(seed, family, attack_type) {
        var availActives = Cards.actives[family][attack_type];
        var randomIndex = random.number(seed).mod(availActives.length);
        return availActives[randomIndex];
    },
    passive_skill: function passive_skill(seed, family) {
        var availPassives = Cards.passives[family];
        var randomIndex = random.number(seed).mod(availPassives.length);
        return availPassives[randomIndex];
    },
    normal: function normal(seed, mean, stdDev, half) {
        var dist = distributions.Normal(mean, stdDev);
        var rn = random.number(seed, {
            min: 0,
            max: 10000,
            precision: 2
        });
        rn /= 10000;
        // https://upload.wikimedia.org/wikipedia/commons/9/9b/Probit_plot.png
        var normal = dist.inv(rn);
        if (half == 1 && normal < mean) normal = 2 * mean - normal;
        if (half == -1 && normal > mean) normal = 2 * mean - normal;
        return Math.round(normal);
    },
    uniform: function uniform(seed, min, max) {
        var dist = distributions.Uniform(min, max);
        var rn = random.number(seed, {
            min: 0,
            max: 10000,
            precision: 2
        });
        rn /= 10000;
        return Math.round(dist.inv(rn));
    }
};

module.exports = card;
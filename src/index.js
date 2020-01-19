const card = require('./card_generator.js')
const random = require('./random.js')
const pack = require('./pack_generator.js')
const heroes = require('./heroes.json');
const passives = require('./passives.json');

const physical = require('./skill_physical.json');
const weapon = require('./skill_weapon.json');
const fire = require('./skill_fire.json');
const chemical = require('./skill_chemical.json');

const actives = {physical,weapon,fire,chemical}

module.exports = {
card,
random,
pack,
heroes,
passives,
actives
};

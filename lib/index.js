'use strict';

var card = require('./card_generator.js');
var random = require('./random.js');
var pack = require('./pack_generator.js');
var heroes = require('./heroes.json');
var passives = require('./passives.json');

var physical = require('./skill_physical.json');
var weapon = require('./skill_weapon.json');
var fire = require('./skill_fire.json');
var chemical = require('./skill_chemical.json');

var actives = { physical: physical, weapon: weapon, fire: fire, chemical: chemical };

module.exports = {
  card: card,
  random: random,
  pack: pack,
  heroes: heroes,
  passives: passives,
  actives: actives
};
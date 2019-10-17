'use strict';

var card = require('./card_generator.js');
var random = require('./random.js');
var seedsPerCard = 30;
var cardsPerPack = 5;

//var list = {total:0,common:0,rare:0,epic:0,legendary:0,mythical:0,building:0,hero:0,unit:0,item:0,tab:{}}

var pack = {
        forge: function forge(seed) {
                var neededSeeds = cardsPerPack * seedsPerCard;

                var seeds = [seed];
                while (seeds.length < neededSeeds) {
                        seeds.push(random.next(seeds[seeds.length - 1]));
                }var cards = [];
                cards.push(card.forge(seeds.splice(0, seedsPerCard), true));
                while (cards.length < cardsPerPack) {
                        cards.push(card.forge(seeds.splice(0, seedsPerCard)));
                } // console.log(cards)
                // cards.forEach(element => {
                //     if(element.type === 'building')
                //     {
                //         list.building +=1
                //     }
                //     else if(element.type === 'item')
                //     {
                //         list.item +=1
                //     }
                //     else if(element.type === 'unit')
                //     {
                //         list.unit +=1
                //     }
                //     else if(element.type === 'hero')
                //     {
                //         if(element.quality === 5)
                //         {
                //             list.common+=1
                //         }
                //         else if(element.quality === 4)
                //         {
                //             list.rare+=1
                //         }
                //         else if(element.quality === 3)
                //         {
                //             list.epic+=1
                //         }
                //         else if(element.quality === 2)
                //         {
                //             list.legendary+=1
                //         }
                //         else
                //         {
                //             list.mythical+=1
                //         }
                //         list.hero = list.common + list.rare + list.epic + list.legendary + list.mythical
                //         if(list.tab[element.hero])
                //         list.tab[element.hero] += 1
                //         else{
                //             list.tab[element.hero] = 1
                //         }
                //     }
                //     list.total+=1

                // });
                // console.log(`Total ${list.total} - Hero :  ${list.hero} Building :  ${list.building} Unit :  ${list.unit} Item :  ${list.item}`)
                // console.log(`Percentage of Hero : ${list.hero/list.total*100}%`)
                // console.log(`Percentage of Building : ${list.building/list.total*100}%`)
                // console.log(`Percentage of Unit : ${list.unit/list.total*100}%`)
                // console.log(`Percentage of Item : ${list.item/list.total*100}%`)

                // console.log(`Percentage of common Hero : ${list.common/list.hero*100}%`)
                // console.log(`Percentage of rare Hero : ${list.rare/list.hero*100}%`)
                // console.log(`Percentage of epic Hero : ${list.epic/list.hero*100}%`)
                // console.log(`Percentage of legendary Hero : ${list.legendary/list.hero*100}%`)
                // console.log(`Percentage of mythical Hero : ${list.mythical/list.hero*100}%`)
                // console.log(list.tab)

                return cards;
        }
};

module.exports = pack;
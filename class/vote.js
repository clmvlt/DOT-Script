const random_percentage = require("random-with-percentage");
const {Client} = require('discord.js');
const {messages, conf, reacts} = new (require('./../class/gestion_json'));
const game = new (require('./gestion_dotgame'));
const sqlvote = new (require('./topgg'));
const Topgg = require("@top-gg/sdk");
const express = require("express");
const webhook = new Topgg.Webhook(process.env.TOPGG_TOKEN);
/**
 * 
 * @param {Client} client 
 */
module.exports = async function (client) {
    const app = express();
    app.post("/dblwebhook", webhook.listener(vote => {
        
        client.guilds.fetch(conf.devGuildId).then(guild=>{
            guild.channels.fetch(conf.channels.vote).then(async c=>{
                var member = await c.guild.members.fetch(vote.user).catch(()=>{});
                var recompense = null;
                var titre = "";
                await sqlvote.addVote(vote.user);
                var count = await sqlvote.countVotes();
                var votes = (await sqlvote.getVotes(vote.user))?.length;
                if (!votes) votes = 1;
                if (member) {
                    // ROLES VOTE
                    if (votes>150){member.roles.add(conf.roles.vote10).catch(()=>{})}else
                    if (votes>120){member.roles.add(conf.roles.vote9).catch(()=>{})}else
                    if (votes>90){member.roles.add(conf.roles.vote8).catch(()=>{})}else
                    if (votes>65){member.roles.add(conf.roles.vote7).catch(()=>{})}else
                    if (votes>45){member.roles.add(conf.roles.vote6).catch(()=>{})}else
                    if (votes>30){member.roles.add(conf.roles.vote5).catch(()=>{})}else
                    if (votes>20){member.roles.add(conf.roles.vote4).catch(()=>{})}else
                    if (votes>10){member.roles.add(conf.roles.vote3).catch(()=>{})}else
                    if (votes>5){member.roles.add(conf.roles.vote2).catch(()=>{})}else
                    if (votes>0){member.roles.add(conf.roles.vote1).catch(()=>{})}

                    // RECOMPENSES

                    async function asyncForEach(array, callback) {
                        for (let index = 0; index < array.length; index++) {
                            await callback(array[index], index);
                        }
                    }
                    const randomArray = [{
                        "name": "xp",
                        "chance": /*61.45*/100
                    },
                    {
                        "name": "dotcoin",
                        "chance": 15
                    },
                    {
                        "name": "bois",
                        "chance": 10
                    },
                    {
                        "name": "pierre",
                        "chance": 7
                    },
                    {
                        "name": "or",
                        "chance": 3
                    },
                    {
                        "name": "salon",
                        "chance": 2
                    },
                    {
                        "name": "grade",
                        "chance": 1
                    },
                    {
                        "name": "cmd",
                        "chance": 0.5
                    },
                    {
                        "name": "paypal",
                        "chance": 0.05
                    }];
                    async function getRec() {
                        var random = Math.floor(Math.random() * 2000);
                        var recompense = null;
                        await asyncForEach(randomArray, async (r) =>{
                            if ((r.chance*20)>random) {
                                recompense = r;
                                return false;
                            } else {
                                return true;
                            }
                        });
                        while (!recompense) recompense = getRec();
                        return recompense?.name;
                    }
                    recompense = await getRec();
                    await game.createProfil(member);
                    switch (recompense) {
                        case "xp": 
                            var x = Math.floor(Math.random() * 101) + 75;
                            titre = `${x}xp`;
                            await game.addXp(member, x);
                            break;
                        case "dotcoin":
                            var x = Math.floor(Math.random() * 11) + 20;
                            titre = `${x}${reacts.dotcoin}`
                            await game.addDotcoin(member, x);
                            break;
                        case "bois": 
                            var x = Math.floor(Math.random() * 26) + 10;
                            titre = `${x}${reacts.bois}`;
                            await game.addBois(member, x);
                            break;
                        case "pierre": 
                            var x = Math.floor(Math.random() * 18) + 8;
                            titre = `${x}${reacts.pierre}`;
                            await game.addPierre(member, x);
                            break;
                        case "or": 
                            var x = Math.floor(Math.random() * 4) + 1;
                            titre = `${x}${reacts.or}`;
                            await game.addPierre(member, x);
                            break;
                        case "salon": titre=`Un salon personalisé sur le discord`;break;
                        case "grade": titre=`Un grade personalisé sur le discord`;break;
                        case "cmd": titre=`Une commande personalisée sur le bot`;break;
                        case "paypal": titre=`1€ PayPal`;break;
                    }
                }
                
                c.send(`Merci à ${member ? `${member.toString()}` : '`Vote anonyme`'} (${votes}) pour le vote (total: ${count})! ${recompense?`Tu as gagné **${titre}** ! GG`:""}`).catch(()=>{});
            })
        });
    }))
        
    app.listen(2435);
}
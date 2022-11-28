const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const game = new (require('./../../class/gestion_dotgame'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

var cooldown = {
    "0": 0
};

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function(m, config) {
    var exist = await game.profilExist(m.member);
    if (!exist) return m.reply(messages.dotgame.profil.youDontExist).catch(()=>{});
    var profil = await game.getProfil(m.member);
    if (!profil) return m.reply(messages.Error).catch(()=>{});
    if (cooldown[m.author.id] && (Date.now() - cooldown[m.author.id]) < 10_000) return m.reply(messages.dotgame.mine.waitTime.replace('{time}', parseInt(((10000-(Date.now()-cooldown[m.author.id])) / 1000))+"s")).catch(()=>{});
    cooldown[m.author.id] = Date.now();
    
    var gold = 0, pierre = 0, bois = 0, xp = 0;
    if (profil.level>=10) {
        gold = Math.floor(Math.random() * 10);
        xp+=gold*Math.floor(Math.random() * 6);
    } 
    if (profil.level>=5) {
        pierre = Math.floor(Math.random() * 20);
        xp+=pierre*Math.floor(Math.random() * 5);
    }
    bois = Math.floor(Math.random() * 30);
    xp+=bois*Math.floor(Math.random() * 3);

    if (bois>0) game.addBois(m.member, bois);
    if (pierre>0) game.addPierre(m.member, pierre);
    if (gold>0) game.addGold(m.member, gold);

    var level = profil.level;
    if (xp>0) await game.addXp(m.member, xp);
    profil = await game.getProfil(m.member);
    if (profil.level > level) m.channel.send(messages.dotgame.profil.newLevel.replace('{user}', m.author.toString()).replace('{level}', profil.level)).catch(()=>{});

    m.channel.send(messages.dotgame.mine.gains.replace('{minage}', `${bois} ${reacts.bois}, ${pierre} ${reacts.pierre}, ${gold} ${reacts.or} +${xp}xp.`)).catch(()=>{});
}
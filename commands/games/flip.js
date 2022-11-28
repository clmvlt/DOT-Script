const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    var rdm = Math.floor(Math.random() * 2);
    var res = rdm==0?"face":"pile";
    var coins = {
        "face": "🪙",
        "pile": "<:zapcoin:987260577565007922>"
    }
    m.channel.send(`Vous lancez une pièce ${coins["pile"]}`).then(m=>{
        var i = 1;
        var inter = setInterval(() => {
            i++;
            m.edit(`Vous lancez une pièce ${coins[i%2==0?"face":"pile"]}`);
            if (i>4) {
                m.edit(`Résultat : ${res} ${coins[res]}`);
                clearInterval(inter);
            }
        }, 400);
    })
}
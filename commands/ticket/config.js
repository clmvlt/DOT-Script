const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

const commandes = ['config'];
const template = 'ticket <Commande¹>\nCommande¹ : '+commandes.join(', ')+'.';

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    m.reply(messages.cmd.ticket.config + '/' + m.guildId).catch(()=>{});
}
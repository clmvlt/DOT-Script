const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const topgg = new (require('./../../class/topgg'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');


/**
 * @param {Message} m 
 * @param {Config} config 
 */
module.exports = async function (m, config) {
    m.channel.send(`https://top.gg/bot/981537507609022554/vote`);
}
const {Message, MessageEmbed, MessageAttachment, Webhook} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const mute = new (require('./../../class/gestion_mutes'));
const game = new (require('./../../class/gestion_dotgame'));
const sql_welcome = new (require('./../../class/gestion_welcome'));
const rm = new (require('../../class/gestion_rolemenu'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');
const Profil = require('./../../class/profil');

/**
 * @param {Message} m 
 */
module.exports = async function (m) {
    if (m.author.id != '602186937482215434') return;

}
const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function (m, config) {
    
    var start = Date.now();
    await sql.ping();
    var sqlPing = Date.now() - start;

    m.reply(`Pong!`).then((m)=>{
        m.edit('Pong! Moi : `'+m.client.ws.ping.toString()+'ms`, API : `'+(Date.now() - m.createdTimestamp).toString()+'ms`, Sql : `'+sqlPing+'ms`.')
    })

}
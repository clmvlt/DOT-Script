const {Message, MessageEmbed, Client} = require('discord.js');

// CLASS
const sql_mute = new (require('./../../class/gestion_mutes'));
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index);
    }
}

/**
 * @param {Client} client
 */
module.exports = async function(client) {
    var mutes = await sql_mute.getMutes().catch(()=>{});
    if (!mutes) return;
    await asyncForEach(mutes, async (mute) => {
        var guild = await client.guilds.fetch(mute?.guildid).catch(()=>{});
        if (!guild) return;
        var member = await guild?.members.fetch(mute?.muted).catch(()=>{});
        if (!member) return;
        if (mute.end_date > 0 && mute.end_date < Date.now()) {
            await sql_mute.unmute(member);
        }
    })
}
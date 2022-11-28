const {Message, MessageEmbed, GuildMember} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const sql_welcome = new (require('./../../class/gestion_welcome'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));

/**
 * @param {GuildMember} member 
 */
module.exports = async function(member) {
    if (!(await sql.moduleWelcomeEnabled(member.guild))) return;
    var config = await sql_welcome.getLeaveConfig(member.guild);
    if (!config || !config.enabled) return;
    var channel = await member.guild.channels.fetch(config.channelid).catch(()=>{});
    if (!channel || !config.message || config.message == 'none' || config.message == '' || !config.enabled) return;
    channel.send(config.message
        .replace('{user.tag}', member.toString())
        .replace('{user.username}', member.user.username)
        .replace('{user.id}', member.id)
    ).catch(()=>{});
}
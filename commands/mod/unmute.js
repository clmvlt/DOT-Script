const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql_mute = new (require('./../../class/gestion_mutes'));
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    if (!(await sql.isMod(m.guild, m.member))) return m.reply(messages.MissPerms).catch(()=>{});
    var member = m.mentions.members.first();
    var args = m.content.split(' ');
    args?.shift();
    var membername = args[0];
    if (!membername) return m.reply(messages.Users.NotFound).catch(()=>{});
    var members = await m.guild.members.fetch();
    if (!member) member = members.find(u=>u.user.id == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.user.tag?.toLowerCase() == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.user.username?.toLowerCase() == membername?.toLowerCase());
    if (!member) return m.reply(messages.Users.NotFound).catch(()=>{});
    if ((await sql.isMod(m.guild, member))) return m.reply(messages.Users.isMod).catch(()=>{});
    var res = await sql_mute.unmute(member);
    m.delete().catch(()=>{});
    switch(res) {
        case 0:
            m.channel.send(messages.cmd.mute.notMuted.replace('{user}', member.toString())).catch(()=>{});
            break;
        case 1:
            m.channel.send(messages.cmd.mute.unmuted.replace('{user}', member.toString())).catch(()=>{});
            break;
        case 2:
            m.channel.send(messages.DotMissPerms).catch(()=>{});
            break;
        default:
            m.channel.send(messages.Error).catch(()=>{});
    }
}
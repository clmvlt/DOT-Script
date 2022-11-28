const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql_mute = new (require('./../../class/gestion_mutes'));
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');
const { stringToTime } = require('string-to-time');

const template = 'tempmute <User> <Durée> <Raison>';

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function(m, config) {
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
    args?.shift();
    var temp = args[0];
    if (!temp) return m.reply(messages.cmd.mute.checkTime.replace('{template}', config.prefix+template)).catch(()=>{});
    args?.shift();
    m.delete().catch(()=>{});
    var raison = args?.join(' ');
    if (!raison) raison = "Aucune";

    var duree = 0;
    var time = stringToTime(temp);
    duree += time.d * 86400000;
    duree += time.h * 3600000;
    duree += time.m * 60000;
    
    var res = await sql_mute.mute(member, m.member, (Date.now() + duree), raison);
    switch(res) {
        case 0:
            m.channel.send(messages.cmd.mute.alreadyMuted.replace('{user}', member.toString()).replace('{raison}', raison)).catch(()=>{});
            break;
        case 1:
            m.channel.send(messages.cmd.mute.tempmuted.replace('{user}', member.toString()).replace('{raison}', raison).replace('{duree}', `\`${time.d}j ${time.h}h ${time.m}m\``)).catch(()=>{});
            break;
        case 2:
            m.channel.send(messages.DotMissPerms).catch(()=>{});
            break;
        default:
            m.channel.send(messages.Error).catch(()=>{});
    }
}
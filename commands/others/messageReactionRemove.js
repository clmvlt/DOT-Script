const {Message, MessageEmbed, MessageReaction, User} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const rm = new (require('../../class/gestion_rolemenu'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));

/**
 * @param {MessageReaction} r 
 * @param {User} u 
 */
module.exports = async function (r, u) {
    if (u.bot) return;
    var rolemenu = await rm.getRMByMsgId(r.message.guild, r.message.id);
    if (!rolemenu) return;
    var roleid = await rm.getRoleInRM(rolemenu.id, r.emoji.name);
    if (!roleid) return;
    var member = await r.message.guild.members.fetch(u.id).catch(()=>{});
    if (!member) return;
    member.roles.remove(roleid).catch(()=>{});
}
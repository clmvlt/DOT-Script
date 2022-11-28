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
    var roles = await sql_welcome.getRoles(member.guild);
    roles?.forEach(async r=>{
        member.guild.roles.fetch(r.roleid).then(r=>{
            member.roles.add(r).catch(()=>{});
        }).catch(()=>{});
    });
}
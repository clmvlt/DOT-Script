const {Message, MessageEmbed} = require('discord.js');

// CLASS
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
    if (!member) member = members.find(u=>u.nickname?.toLowerCase() == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.user.username?.toLowerCase() == membername?.toLowerCase());
    if (!member) return m.reply(messages.Users.NotFound).catch(()=>{});
    var averts = await sql.getAverts(m.guild, member);
    
    const embedAverts = new MessageEmbed();
    embedAverts.setTitle("📍 Avertissemnts 📍");
    embedAverts.setColor("RED");
    embedAverts.setFooter({
        text: messages.EmbedsFooter.replace('{guild.name}', m.guild.name).replace('{date}', dates.format(new Date(Date.now()))),
        iconURL: m.guild.iconURL()
    });
    embedAverts.setColor('#84B8E7');

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    await asyncForEach(averts, async (avert) => {
        embedAverts.setDescription(
            (embedAverts.description ? embedAverts.description : "") +
            `\n**${dates.format(new Date(parseInt(avert.date_avert)))}** par <@${avert.averter}>. Raison : \`${avert.reason}\``
        );
    })

    if (averts.length == 0) embedAverts.setDescription('Aucuns avertissemnts.');

    m.reply({
        embeds: [embedAverts]
    }).catch(()=>{});
}
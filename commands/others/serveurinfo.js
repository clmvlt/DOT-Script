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
    
    const embedSi = new MessageEmbed();
    embedSi.setColor('#84B8E7');
    embedSi.setAuthor({
        name: m.client.user.username,
        iconURL: m.client.user.avatarURL(),
        url: "https://bot-dot.fr/"
    });
    embedSi.setThumbnail(m.guild.iconURL());
    embedSi.setDescription(`
    🔧 Configration du serveur :

    Prefix : \`${config.prefix}\`
    Rôles modérateurs : ${(await sql.modRoles(m.guild)).flatMap(r=>r.toString())}
    
    🌍 Serveur :
    
    Membres : \`${(await m.guild.members.fetch()).filter(m=>!m.user.bot).size}\` joueurs et \`${(await m.guild.members.fetch()).filter(m=>m.user.bot).size}\` bots
    Création : ${(await m.guild.fetchOwner()).toString()}, le \`${dates.format(new Date(m.guild.createdAt))}\`
    Émojis : ${(await m.guild.emojis.fetch()).toJSON().flatMap(e=>e.toString()).join(', ')}
    Rôles : \`${(await m.guild.roles.fetch()).size}\`
    Boosts : \`${m.guild.premiumSubscriptionCount}\`
    Channels : \`${(await m.guild.channels.fetch()).size}\`
    Description : \`${m.guild.description ? m.guild.description : "Aucune"}\`
    Bans : \`${(await m.guild.bans.fetch()).size}\`

    `);
    if (m.guild.banner) embedSi.setImage(m.guild.bannerURL());
    m.channel.send({
        embeds: [embedSi]
    }).catch(()=>{});
}
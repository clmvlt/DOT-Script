const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config 
 * @param {Number} uptime 
 */
module.exports = async function (m, config, uptime) {
    var servs = (await m.client.guilds.fetch()).toJSON();
    var nbServs = servs.length;
    var nbMembersGuilds = servs.flatMap(async g=> (await g.fetch()).memberCount);
    var nbMembers = 0;

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    await asyncForEach(nbMembersGuilds, async (nb) => {
        nbMembers+= await nb;
    })

    const embed = new MessageEmbed();
    embed.setColor('#84B8E7');
    embed.setAuthor({
        name: m.client.user.username,
        iconURL: m.client.user.avatarURL(),
        url: "https://bot-dot.fr/"
    });
    embed.setThumbnail(m.client.user.avatarURL());
    embed.setDescription(`

        Username : \`${m.client.user.username}\`, Tag : \`${m.client.user.discriminator}\`
        Bot créé le : \`${dates.format(m.client.user.createdAt)}\`
        Créateur : \`Dimzou#0001\`
        Serveur support : https://discord.gg/bkFW9q4H6r
        Préfix par défaut : \`${conf.defaultPrefix}\` (\`${config.prefix}\` sur ce serveur)

        Serveurs : \`${nbServs}\`
        Membres : \`${nbMembers}\`

        Site web : https://bot-dot.fr

        Lancé depuis : \`${dates.depuis(new Date(Date.now() - uptime))}\`
    `);
    m.channel.send({embeds:[embed]}).catch(()=>{});
}
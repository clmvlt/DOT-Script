const {Message, MessageEmbed, Guild} = require('discord.js');

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

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    var desc = '';
    await asyncForEach(servs, /** @param {Guild} s */async (s) =>{
        var g = await s.fetch();
        desc+=`**${g.name}**, \`${(g.memberCount)}\` membres, depuis \`${dates.depuisJJ(new Date(Date.now()-g.joinedAt))}\`\n`;
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
        ${desc}
    `);
    m.channel.send({embeds:[embed]}).catch(()=>{});
}
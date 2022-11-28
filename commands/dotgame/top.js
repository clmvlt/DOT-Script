const {Message, MessageEmbed, MessageAttachment} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const mute = new (require('./../../class/gestion_mutes'));
const game = new (require('./../../class/gestion_dotgame'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');
const Profil = require('./../../class/profil');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function (m, config) {
    var desc = '';

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    const embed = new MessageEmbed();
    embed.setAuthor({
        name: m.client.user.username,
        iconURL: m.client.user.avatarURL()
    });
    embed.setFooter({
        text: messages.EmbedsFooter.replace('{guild.name}', m.guild.name).replace('{date}', dates.format(new Date(Date.now()))),
        iconURL: m.guild.iconURL()
    });
    embed.setColor('#84B8E7');
    
    var top = await game.getTopLevel();
    await asyncForEach(top, /** @param {Profil} t */async function (t) {
        var topN = 1+top.indexOf(t);
        desc+=`**${topN} :** <@${t.memberid}> Niveau \`${t.level}\` (${t.exp}/${game.xpNextLvl(t.exp)})
        `;
    });
    embed.setDescription(desc);
    
    m.channel.send({embeds: [embed]});
}
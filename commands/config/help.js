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
module.exports = function (m, config) {
    var args = m.content.split(' ');
    var embeds = [];

    const embedInfos = new MessageEmbed();
    embedInfos.setAuthor({
        name: m.client.user.username + " | Aide",
        iconURL: m.client.user.avatarURL()
    });
    embedInfos.setFooter({
        text: messages.EmbedsFooter.replace('{guild.name}', m.guild.name).replace('{date}', dates.format(new Date(Date.now()))),
        iconURL: m.guild.iconURL()
    });
    embedInfos.setColor('#84B8E7');
    embedInfos.setDescription('Bot développé par `Dimzou#0001`\nPanneau de configuration : https://bot-dot.fr/index.php/serveurs');
    embeds.push(embedInfos);

    help.forEach(type=>{
        var embed = new MessageEmbed();
        embed.setDescription((embed.description ? embed.description : "") + "\n\n**" + type.libelle + "**");
        type.cmds.forEach(cmd=>{
            embed.setDescription(embed.description + (type.cmds.indexOf(cmd) == 0 ? "\n" : "") + 
            `\n${config.prefix}${cmd.cmd} : \`${cmd.desc}\``);
        });
        embed.setColor(type.color)
        embeds.push(embed);
    });

    m.member.send({
        embeds: embeds
    }).then(()=>{
        m.react(reacts.help).catch(()=>{});
    }).catch(()=>{
        m.channel.send({
            embeds: embeds
        }).catch(()=>{
            m.channel.send(messages.Error).catch(()=>{});
        })
    });

}
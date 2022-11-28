const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const game = new (require('./../../class/gestion_dotgame'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function(m, config) {
    var exist = await game.profilExist(m.member);
    if (exist) return m.reply(messages.dotgame.profil.alreadyExist).catch(()=>{});
    var created = await game.createProfil(m.member);
    if (!created) return m.reply(messages.dotgame.profil.alreadyExist).catch(()=>{});
    var profil = await game.getProfil(m.member);
    if (!profil) return m.reply(messages.Error).catch(()=>{});
    
    
    var embed = new MessageEmbed({
        author: {
            iconURL: m.author.avatarURL(),
            name: m.author.username
        },
        thumbnail: {
            url: m.guild.iconURL()
        },
        color: "#84B8E7",
        description: `
        ${m.author.toString()} vient de rejoindre l'aventure ! 🌲

        \`${config.prefix}stop\` pour te supprimer de l'aventure (attention tu perdras tout ton stuff).
        \`${config.prefix}profil <User>\` pour voir ton profil ou celui de quelqu'un d'autre.
        \`${config.prefix}tuto\` pour apprendre a jouer.

        `,
        fields: [
            {
                name: "Ton Stuff",
                value: `
                \`${profil.bois}\` ${reacts.bois}
                \`${profil.pierre}\` ${reacts.pierre}
                \`${profil.gold}\` ${reacts.or}
                `,
                inline: true
            },
            {
                name: "Ton Profil",
                value: `
                Niveau : \`${profil.level}\` (${profil.exp}/${game.xpNextLvl(profil.level)})
                `,
                inline: true
            },
            {
                name: "Ton Argent",
                value: `
                \`${profil.dotcoin}\` ${reacts.dotcoin} 
                `,
                inline: true
            }
        ]
    });
    
    m.channel.send({
        content: messages.dotgame.profil.created,
        embeds: [embed]
    }).catch(()=>{})
}
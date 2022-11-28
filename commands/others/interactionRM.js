const {Message, MessageEmbed, MessageReaction, User, ButtonInteraction} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const rm = new (require('../../class/gestion_rolemenu'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));

/**
 * @param {ButtonInteraction<CacheType>} it
 */
module.exports = async function (it) {
    if (it.user.bot) return;
    var roleid = it.customId.split(':')[1];
    var role = await it.guild.roles.fetch(roleid).catch(()=>{});
    if (!role) {
        return it.reply({
            ephemeral: true,
            content: "Le rôle est introuvable."
        })
    }
    if (it.member.roles.cache.has(roleid)) {
        it.member.roles.remove(roleid).catch(()=>{});
        it.reply({
            ephemeral: true,
            content: "Le rôle " + role.toString() + ", vous a été retiré !"
        }).catch(()=>{});
    } else {
        it.member.roles.add(roleid).catch(()=>{});
        it.reply({
            ephemeral: true,
            content: "Le rôle " + role.toString() + ", vous a été ajouté !"
        }).catch(()=>{});
    }
}
const {Message, MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const sql_ticket = new (require('./../../class/gestion_tickets'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

const commandes = ['config'];
const template = 'ticket <Commande¹>\nCommande¹ : '+commandes.join(', ')+'.';

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    if (!(await sql.isMod(m.guild, m.member))) return m.reply(messages.MissPerms).catch(()=>{});
    var ticket = await sql_ticket.getTicket(m.guild, m.channel);
    if (!ticket) return m.reply({content: messages.cmd.ticket.ticketNotFound, ephemeral: true}).catch(()=>{});
    if (ticket.etat == 2) return m.reply({content: messages.cmd.ticket.ticketNotFound, ephemeral: true}).catch(()=>{});
    
    await sql_ticket.setTicketHandleder(ticket.id_ticket, m.member);
    m.channel.permissionOverwrites.set([
        {
            id: m.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
            id: ticket.author,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
            id: m.member.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
    ]).catch(()=>{});
    await m.delete().catch(()=>{});
    m.channel.send(messages.cmd.ticket.claimed.replace('{claimer}', m.member.toString())).catch(()=>{});
}
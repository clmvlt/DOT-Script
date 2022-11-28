const {Message, MessageEmbed, ButtonInteraction, MessageActionRow, MessageButton} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const sql_ticket = new (require('./../../class/gestion_tickets'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

const commandes = ['config'];
const template = 'ticket <Commande¹>\nCommande¹ : '+commandes.join(', ')+'.';

/**
 * @param {ButtonInteraction<CacheType>} it 
 */
module.exports = async function(it) {
    var ticket = await sql_ticket.getTicket(it.guild, it.channel);
    if (ticket.etat == 2) return it.reply({content: messages.cmd.ticket.alreadyClose, ephemeral: true}).catch(()=>{});
    await it.deferUpdate().catch(()=>{});
    it.channel.setName('fermé-'+ticket.id_ticket).catch(()=>{});
    setTimeout(() => {
        it?.channel?.permissionOverwrites.edit(it.user.id, {
            VIEW_CHANNEL: false
        }).catch(()=>{});
    }, 3000);

    setTimeout(() => {
        it?.channel?.delete().catch(()=>{it?.channel?.send(messages.Error).catch(()=>{})});
    }, 60000);
    await sql_ticket.setTicketEtat(ticket.id_ticket, 2);
    await sql_ticket.setTicketEnd(ticket.id_ticket, Date.now());
    it.channel.send('🔒 Fermeture du ticket dans 60s.').catch(()=>{});
    it.channel.send('Fermé par : ' + it.user.toString()).catch(()=>{});
    it.message.delete().catch(()=>{});
}
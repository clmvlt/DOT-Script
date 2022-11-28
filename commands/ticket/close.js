const {Message, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');

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
    if (ticket.etat == 2) return m.reply({content: messages.cmd.ticket.alreadyClose, ephemeral: true}).catch(()=>{});
    
    const ticketButtons = new MessageActionRow()
    ticketButtons.addComponents([
        new MessageButton().setCustomId('confirm_delete:'+ticket.id_ticket).setLabel('🔒 Fermer').setStyle('DANGER'),
        new MessageButton().setCustomId('cancel_delete:'+ticket.id_ticket).setLabel('Annuler').setStyle('SECONDARY'),
    ]);
    m.channel.send({
        content: `Êtes-vous sûr de vouloir fermer le ticket ?`,
        components: [ticketButtons]
    });
}
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
    
    const ticketButtons = new MessageActionRow()
    ticketButtons.addComponents([
        new MessageButton().setCustomId('confirm_delete:'+ticket.id_ticket).setLabel('🔒 Fermer').setStyle('DANGER'),
        new MessageButton().setCustomId('cancel_delete:'+ticket.id_ticket).setLabel('Annuler').setStyle('SECONDARY'),
    ]);
    await it.deferUpdate().catch(()=>{});
    it.channel.send({
        content: `Êtes-vous sûr de vouloir fermer le ticket ?`,
        components: [ticketButtons]
    });
}
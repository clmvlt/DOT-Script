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
    if (!await sql.moduleTicketEnabled(it.guild)) return it.reply({content: messages.ModuleOFF, ephemeral: true});
    it.reply({
        ephemeral: true,
        content: `Création du ticket...`
    }).catch(()=>{});
    var channel = await sql_ticket.createTicket(it.guild, it.member);
    var ticket = await sql_ticket.getTicket(it.guild, channel);
    if (!channel || !ticket) return it.editReply({
        ephemeral: true,
        content: `${messages.Error}`
    });
    it.editReply({
        ephemeral: true,
        content: `Ticket créé : <#${channel.id}>`
    }).catch(()=>{});

    const ticketButtons = new MessageActionRow()
    ticketButtons.addComponents(
        new MessageButton().setCustomId('delete_ticket:'+ticket.id_ticket).setLabel('🔒 Fermer').setStyle('DANGER'),
    );

    const embedTicket = new MessageEmbed();
        embedTicket.setDescription('Cliquez sur 🔒 pour fermer le ticket.');
        embedTicket.setFooter({
            text: messages.EmbedsFooter.replace('{guild.name}', 'Tickets').replace('{date}', dates.format(new Date(Date.now()))),
            iconURL: it.guild.iconURL()
        });
        embedTicket.setColor('#55A455');

    channel.send({
        content: `Bonjour <@${ticket.author}> !`,
        components: [ticketButtons],
        embeds: [embedTicket]
    });
}
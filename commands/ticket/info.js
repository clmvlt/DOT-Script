const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const sql_tickets = new (require('./../../class/gestion_tickets'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

const commandes = ['config'];
const template = 'ticket <Commande¹>\nCommande¹ : '+commandes.join(', ')+'.';

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    var args = m.content.split(' ');
    args?.shift();
    args?.shift();
    var id_ticket = args[0];
    var ticket = await sql_tickets.getTicketById(m.guild, id_ticket);
    if (!ticket) return m.reply(messages.cmd.ticket.ticketNotFound).catch(()=>{});

    var hand = await m.guild.members.fetch(ticket.handleder).catch(()=>{});
    var auth = await m.guild.members.fetch(ticket.author).catch(()=>{});
    var channel = await m.guild.channels.fetch(ticket.channelid).catch(()=>{});
    
    var embed = new MessageEmbed();
    embed.setColor('#84B8E7');
    embed.setAuthor({
        name: m.author.username,
        iconURL: m.author.avatarURL(),
        url: "https://bot-dot.fr/"
    });
    embed.setDescription(`
        ID: \`${ticket.id_ticket}\`
        Auteur : ${auth ? auth?.toString() : "Introuvable"} Modérateur : ${hand ? hand?.toString() : "Aucun"}

        Date d'ouverture : \`${dates.format(new Date(parseInt(ticket.date_creation)))}\`
        Date de fermeture : \`${parseInt(ticket.date_end)>0? dates.format(new Date(parseInt(ticket.date_end))) : "Ticket ouvert."}\`
        
        État : ${ticket.etat==1?reacts.pour+" Ouvert":reacts.contre+"Fermé"}
    `);
    m.channel.send({embeds:[embed]}).catch(()=>{})
}
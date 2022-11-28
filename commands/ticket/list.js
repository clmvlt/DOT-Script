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
    var author = m.author;
    var pageTicket = 0;
    const ticketsOnPage = 10;
    var members = await m.guild.members.fetch();
    
    async function getEmbed(ticketsOnPage, page) {
        if (page < 0) pageTicket = 0;
        var nbTickets = await sql_tickets.nbTickets(m.guild);
        var maxPage = Math.ceil(nbTickets / ticketsOnPage);
        if (page >= maxPage) pageTicket = maxPage-1;
        var tickets = await sql_tickets.getGuildTickets(m.guild, ticketsOnPage, pageTicket*ticketsOnPage);

        var embed = new MessageEmbed();
        embed.setColor('#84B8E7');
        embed.setAuthor({
            name: m.author.username,
            iconURL: m.author.avatarURL(),
            url: "https://bot-dot.fr/"
        });
        if (tickets.length>0)
        embed.setDescription(`
            \`ticket info <ID>\` pour plus d'infomrations sur un ticket.

            ${tickets.flatMap(t=>{
                var author = members.find(m=>m.id==t.author) ? members.find(m=>m.id==t.author).toString() : "Introuvable";
                return ` ID: \`${t.id_ticket}\` \`${dates.format(new Date(parseInt(t.date_creation)))}\` Ouvert: ${t.etat==1?reacts.pour:reacts.contre} Auteur : ${author}`
            }).join('\n')}
        `);
        if (tickets.length<=0) embed.setDescription(`Aucuns tickets.`);
        embed.setFooter({
            text: `Page ${pageTicket+1}/${maxPage}`
        })
        return embed;
    }
    var embed = await getEmbed(ticketsOnPage, pageTicket);

    m.channel.send({
        embeds:[embed]
    }).catch(()=>{}).then((m)=>{
        m.react(reacts.before);
        m.react(reacts.next);
        const filter = (r, user) => {return user.id === author.id};
        const c = m.createReactionCollector({ filter, time: 240_000 });
        c.on('collect', async (r, user) => {
            await r.users.remove(user);
            switch (r.emoji.name) {
                case reacts.next:
                    pageTicket++;
                    break;
                case reacts.before:
                    pageTicket--;
                    break;
            }
            var embed = await getEmbed(ticketsOnPage, pageTicket);
            m.edit({embeds:[embed]}).catch(()=>{});
        });

    });
}
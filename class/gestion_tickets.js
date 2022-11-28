const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, GuildTextBasedChannel } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));
const TicketConfig = require('./ticket_config');
const Ticket = require('./ticket');

module.exports = function() {
    /**
     * @returns {Promise<TicketConfig>}
     * @param {Guild} guild
     */
     this.getTicketConfig = async function(guild) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from ticket_config where guildid = $1', [guild.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<GuildTextBasedChannel>}
     * @param {Guild} guild
     * @param {GuildMember} author
     */
     this.createTicket = async function(guild, author) {
        var client = await sql.getClient();
        await sql.check(guild);
        var configticket = await this.getTicketConfig(guild);
        if (!configticket) return null;
        var cat = null;
        if (configticket.categorieid != 'none') cat = await guild.channels.fetch(configticket?.categorieid);
        var channel = await guild.channels.create('ticket', {
            parent: cat?.id,
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: author.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        }).catch(()=>{});
        var mods = await sql.modRoles(guild);
        mods.forEach(r=>{
            channel.permissionOverwrites.create(r.id ,{
                VIEW_CHANNEL: true
            })
        });
        var res = await client.query('insert into ticket (author, handleder, date_creation, guildid, channelid, etat, date_end) values ($1, $2, $3, $4, $5, $6, $7) returning id_ticket', [author.id, 'none', Date.now(), guild.id, channel.id, 1, -1]).catch(()=>{});
        setTimeout(async () => {
            await channel.setName(channel?.name+"-"+res?.rows[0].id_ticket).catch(()=>{});
        }, 3000);
        //await client.end();
        return channel;
    }

    /**
     * @returns {Promise<Ticket>}
     * @param {GuildTextBasedChannel} channel
     * @param {Guild} guild
     */
     this.getTicket = async function(guild, channel) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('SELECT * from ticket where guildid = $1 and channelid = $2', [guild.id, channel.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket>}
     * @param {Number} id
     * @param {Guild} guild
     */
     this.getTicketById = async function(guild, id) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('SELECT * from ticket where guildid = $1 and id_ticket = $2', [guild.id, id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket[]>}
     * @param {Guild} guild
     * @param {Number} limit
     * @param {Number} page
     */
     this.getGuildTickets = async function(guild, limit, page) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('SELECT * from ticket where guildid = $1 order by id_ticket desc limit $2 offset $3', [guild.id, limit, page]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Number>}
     * @param {Guild} guild
     */
     this.nbTickets = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('SELECT count(*) from ticket where guildid = $1', [guild.id]).catch(()=>{}))?.rows[0]?.count;
        //await client.end();
        return parseInt(res);
    }

    /**
     * @returns {Promise<Ticket>}
     * @param {Number} id_ticket
     * @param {Number} etat
     */
     this.setTicketEtat = async function(id_ticket, etat) {
        var client = await sql.getClient();
        var res = (await client.query('update ticket set etat = $2 where id_ticket = $1', [id_ticket, etat]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket>}
     * @param {Number} id_ticket
     * @param {GuildMember} hand
     */
     this.setTicketHandleder = async function(id_ticket, hand) {
        var client = await sql.getClient();
        var res = (await client.query('update ticket set handleder = $2 where id_ticket = $1', [id_ticket, hand.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket>}
     * @param {Number} id_ticket
     * @param {Number} end
     */
     this.setTicketEnd = async function(id_ticket, end) {
        var client = await sql.getClient();
        var res = (await client.query('update ticket set date_end = $2 where id_ticket = $1', [id_ticket, end]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket[]>}
     */
     this.getEndedTickets = async function() {
        var client = await sql.getClient();
        var timeEnd = Date.now() - 70_000;
        var res = (await client.query('select * from ticket where date_end > $1', [timeEnd]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Ticket[]>}
     */
     this.getOpenTickets = async function() {
        var client = await sql.getClient();
        var res = (await client.query('select * from ticket where date_end <= 0').catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }
}

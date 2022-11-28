const {Client, Discord, Intents, ContextMenuInteraction, Role} = require('discord.js');

const intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES", 'GUILD_SCHEDULED_EVENTS', 'GUILD_INTEGRATIONS', 'GUILD_PRESENCES', 'GUILD_WEBHOOKS', "GUILD_BANS"];
const client = new Client({ intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_SCHEDULED_EVENT'] });

var uptime = 0;

// CLASS
const sql_tickets = new (require('./class/gestion_tickets'));
const {messages, conf} = new (require('./class/gestion_json'));
const sql = new (require('./class/gestion_sql'));
const dates = new (require('./class/gestion_date'));

client.login(process.env.CLIENT_TOKEN);

client.on('ready', async () => {
    sql.start();
    uptime = Date.now();
    var guilds = await client.guilds.fetch();
    //console.table(guilds.toJSON().map(g=>{return {"Nom":g.name, "Acronyme":g.nameAcronym, "Création":dates.format(g.createdAt), "Certifiée":g.verified}}));
    console.log('Connecté : ' + client.user.tag);
    console.log(guilds.size + ` servers!`);
    setInterval(async () => {
        require('./commands/mod/check_unmute')(client);
    }, 10000);
    client.user.setActivity({
        type: "STREAMING",
        name: "Salut!",
        url: "http://www.bot-dot.fr/"
    });
    var members = 0;
    var nbguilds = guilds.size;
    guilds.forEach(g=>{g.fetch().then(g=>members+=g.memberCount)});
    setInterval(async () => {
        var guilds = await client.guilds.fetch().catch(()=>{});
        nbguilds = guilds?.size;
        members = 0;
        guilds?.forEach(g=>{g.fetch().then(g=>members+=g.memberCount)});
    }, 120_000);
    setInterval(() => {
        var names= ["Wow! " + nbguilds + "serveurs!", members + " membres!"];
        var rdm = Math.floor(Math.random() * names.length);
        client.user.setActivity({
            type: "STREAMING",
            name: names[rdm],
            url: "https://bot-dot.fr/"
        });
    }, 30_000);
    sql_tickets.getEndedTickets().then(tickets=>{
        tickets.forEach(t=>{
            var tm = 60_000 - (Date.now() - t.date_end);
            if (tm<0)tm=1000;
            setTimeout(() => {
                client.channels.fetch(t.channelid).then(c=>c.delete().catch(()=>{})).catch(()=>{});
            }, tm);
        });
    });
    sql_tickets.getOpenTickets().then(tickets=>{
        tickets.forEach(async t=>{
            var c = await client.channels.fetch(t.channelid).catch(()=>{});
            if (!c) {
                sql_tickets.setTicketEtat(t.id_ticket, 2);
                sql_tickets.setTicketEnd(t.id_ticket, Date.now());
            }
        });
    });
    require('./class/vote')(client);
});

client.on('messageCreate', async (m) =>{
    if (!m || m.author.bot || !m.content) return;
    if (m.channel.id === conf.channels.rapports) return;
    if (m.channel.type == 'DM') return m.channel.send("Oups 😵‍💫, j'ai trop de MP's pour pouvoir répondre.");
    if (m.channel.type != 'GUILD_TEXT') return;
    var config = await sql.getConfig(m.guild);
    if (!m.content.startsWith(config.prefix)) return;
    var args = m.content.split(' ');
    var cmd = args[0]?.toLowerCase().replace(config.prefix, '');

    // Module de base
    switch (cmd) {
        case "prefix": require('./commands/config/prefix')(m, config); break;
        case "help": case "aide": case "h": case "?": require('./commands/config/help')(m, config); break;
        case "ping":  require('./commands/others/ping')(m, config); break;
        case "si":case "serveurinfo":  require('./commands/others/serveurinfo')(m, config); break;
        case "ui":case "userinfo":  require('./commands/others/userinfo')(m, config); break;
        case "bi":case "botinfo":  require('./commands/others/botinfo')(m, config, uptime); break;
        case "dot":  require('./commands/config/dot')(m, config); break;
        case "meteo":  require('./commands/others/meteo')(m); break;
        case "vote":case "votes":case "v":  require('./commands/others/vote')(m); break;
        case "serveurlist":case "serveurslist":case "serverslist":case "sl":  require('./commands/others/serveurlist')(m); break;
    }

    // Module modération
    if (await sql.moduleModEnabled(m.guild))
        switch (cmd) {
            case "kick":  require('./commands/mod/kick')(m); break;
            case "ban":  require('./commands/mod/ban')(m); break;
            case "avert":  require('./commands/mod/avert')(m); break;
            case "avertclear":  require('./commands/mod/avertclear')(m); break;
            case "avertlist":  require('./commands/mod/avertlist')(m); break;
            case "mute":  require('./commands/mod/mute')(m); break;
            case "unmute":  require('./commands/mod/unmute')(m); break;
            case "tempmute":  require('./commands/mod/tempmute')(m, config); break;
        }

    // Module Ticket
    if (await sql.moduleTicketEnabled(m.guild))
        switch (cmd) {
            case "ticket":  require('./commands/ticket/ticket')(m); break;
            case "close":  require('./commands/ticket/close')(m); break;
            case "claim":  require('./commands/ticket/claim')(m); break;
        }

    // Module Games
    //if (await sql.moduleTicketEnabled(m.guild))
        switch (cmd) {
            case "flip":  require('./commands/games/flip')(m); break;
            case "pfc":case "rpc":case "pierrefeuilleciseaux":  require('./commands/games/pfc')(m); break;
        }

    // Module DOT Game
    //if (await sql.moduleTicketEnabled(m.guild))
    //if (m.author.id=='602186937482215434')
        switch (cmd) {
            case "start":  require('./commands/dotgame/start')(m, config); break;
            case "stop":  require('./commands/dotgame/stop')(m); break;
            case "profil":case "p":  require('./commands/dotgame/profil')(m); break;
            case "tuto": require('./commands/dotgame/tuto')(m, config); break;
            case "mine": require('./commands/dotgame/mine')(m, config); break;
            case "top": require('./commands/dotgame/top')(m); break;
        }
    
});

client.on('guildCreate', async (guild) => {
    await sql.addGuild(guild);
    var guild = await guild.fetch();
    require('./commands/canvas/guildCreate')(guild);
})

client.on('guildDelete', async (guild) => {
    await sql.removeGuild(guild);
    client.guilds.fetch(conf.devGuildId).then(g=>{
        g.channels.fetch(conf.channels.serveurs).then(async c=>{
            const {reacts} = new (require('./class/gestion_json'));
            c.send(`${reacts.contre} Le serveur **${guild.name}** vient de nous quitter.`).catch(()=>{});
        });
    });
});

client.on('guildMemberUpdate', async (member) =>{
    if (member.partial) await member.fetch();
    const sql_mute = new (require('./class/gestion_mutes'));
    var role = await sql_mute.mutedRole(member.guild);
    if (!role) return;
    if (await sql_mute.isMuted(member) && member.roles.cache.has(role.id)) {
        await sql_mute.unmute(member);
    }
});

client.on('channelCreate', async (c) =>{
    const sql_mute = new (require('./class/gestion_mutes'));
    var r = await sql_mute.mutedRole(c.guild);
    if (c.type=='GUILD_VOICE') {
        c.permissionOverwrites.create(r.id ,{
            SPEAK: false
        }).catch(()=>{});
    } else if (c.type=='GUILD_TEXT' || c.type=='GUILD_CATEGORY') {
        c.permissionOverwrites.create(r.id ,{
            SEND_MESSAGES: false
        }).catch(()=>{});
    }
});

client.on('channelDelete', async (c) =>{
    sql_tickets.getTicket(c.guild, c).then(t=>{
        if (t==null)return;
        sql_tickets.setTicketEtat(t.id_ticket, 2);
        sql_tickets.setTicketEnd(t.id_ticket, Date.now());
    });
})

client.on('interactionCreate', async (it) =>{
    if (!it.isButton()) return;
    if (it.customId.startsWith('create_ticket')) require('./commands/ticket/create_ticket')(it);
    if (it.customId.startsWith('delete_ticket')) require('./commands/ticket/delete_ticket')(it);
    if (it.customId.startsWith('confirm_delete')) require('./commands/ticket/confirm_delete')(it);
    if (it.customId.startsWith('cancel_delete')) it.message.delete().catch(()=>{});
});

client.on('guildMemberAdd', (member) =>{
    require('./commands/welcome/welcome.js')(member);
    require('./commands/welcome/welcomeroles.js')(member);
});

client.on('guildMemberRemove', (member) =>{
    require('./commands/welcome/bye.js')(member);
});

client.on('messageReactionAdd', async (r, u) => {
    var react = await r.fetch().catch();
    var user = await u.fetch().catch();
    if (!react || !user) return;
    require('./commands/others/messageReactionAdd')(react, user);
});

client.on('messageReactionRemove', async (r, u) => {
    var react = await r.fetch().catch();
    var user = await u.fetch().catch();
    if (!react || !user) return;
    require('./commands/others/messageReactionRemove')(react, user);
});

client.on('interactionCreate', (it) => {
    if (!it.isButton()) return;
    if (it.customId.startsWith('rm:')) require('./commands/others/interactionRM')(it);
});

require('./logs/logs')(client);

process.on('unhandledRejection', (error) => {
	console.log(error);
    client.guilds.fetch(conf.devGuildId).then(guild=>{
        guild.channels.fetch(conf.channels.rapports).then(channel=>{
            channel.send(`\`\`\`json\n${error}\`\`\``).catch(()=>{});
        });
    });
});
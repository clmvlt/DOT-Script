const {Message, MessageEmbed, Client} = require('discord.js');

// CLASS
const sql = new (require('./../class/gestion_sql'));
const logs = new (require('./../class/gestion_logs'));
const dates = new (require('./../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../class/gestion_json'));
const Config = require('./../class/config');

/** 
 * @param {Client} client 
 */
module.exports = async function(client) {

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }
    
    client.on('messageDelete', async (m) => {
        if ((await logs.moduleLogsEnabled(m.guild)) == false) return;
        if (await logs.logEnable(m.guild, await logs.idLog('messageDelete')) == false) return;
        var channel = await logs.logChanel(m.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        if (!m.member || !m.author) return;
        embed.setColor('BLUE');
        embed.setDescription(`
        Message de ${m.author?.toString()} supprimé dans ${m.channel?.toString()}
        \`${((m.content == null || m.content == '') ? "Message vide" : m.content)}\`
        `);
        embed.setAuthor({
           name: m?.member?.user.username,
           iconURL: m?.member?.user.avatarURL(),
           url: m?.url 
        });
        embed.setFooter({
            text: `Author id: ${m.author.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        }).catch(()=>{});
    });

    client.on('messageUpdate', async (m, newm) => {
        if ((await logs.moduleLogsEnabled(newm.guild)) == false) return;
        if (await logs.logEnable(newm.guild, await logs.idLog('messageUpdate')) == false) return;
        var channel = await logs.logChanel(newm.guild);
        if (!channel) return;
        if ((!m.content || m.content=='') && (!newm.content || newm.content=='')) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        Message de ${newm.author?.toString()} modifié dans ${newm.channel?.toString()}
        
        Avant : 
        \`${((m.content == null || m.content == '') ? "Message vide" : m.content)}\`

        Maintenant :
        \`${((newm?.content == null || newm?.content == '') ? "Message vide" : newm?.content)}\`
        `);
        embed.setAuthor({
           name: newm?.author.username,
           iconURL: newm?.author.avatarURL(),
           url: newm?.url
        });
        embed.setFooter({
            text: `Author id: ${newm.author?.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('messageDeleteBulk', async (m) => {
        var guild = m.first().guild;
        if ((await logs.moduleLogsEnabled(guild)) == false) return;
        if (await logs.logEnable(guild, await logs.idLog('messageDeleteBulk')) == false) return;
        var channel = await logs.logChanel(guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            ${m.size} messages supprimés.
        `);
        embed.setFooter({
            text: `${dates.format(new Date(Date.now()))}`
        });
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('messageReactionAdd', async (r, user) => {
        if ((await logs.moduleLogsEnabled(r.message.guild)) == false) return;
        if (await logs.logEnable(r.message.guild, await logs.idLog('messageReactionAdd')) == false) return;
        var channel = await logs.logChanel(r.message.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${user.toString()} a ajouté la réaction ${r.emoji.name} sur [ce message](${r.message.url})
        `);
        embed.setAuthor({
           name: user.username,
           iconURL: user.avatarURL(),
           url: r.message.url
        });
        embed.setFooter({
            text: `Author id: ${user.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('messageReactionRemove', async (r, user) => {
        if ((await logs.moduleLogsEnabled(r.message.guild)) == false) return;
        if (await logs.logEnable(r.message.guild, await logs.idLog('messageReactionAdd')) == false) return;
        var channel = await logs.logChanel(r.message.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        La réaction de ${user.toString()} ${r.emoji.name} a été retiré sur [ce message](${r.message.url})
        `);
        embed.setAuthor({
           name: user.username,
           iconURL: user.avatarURL(),
           url: r.message.url
        });
        embed.setFooter({
            text: `Author id: ${user.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('inviteCreate', async (invite) => {
        if ((await logs.moduleLogsEnabled(invite.guild)) == false) return;
        if (await logs.logEnable(invite.guild, await logs.idLog('inviteCreate')) == false) return;
        var channel = await logs.logChanel(invite.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${invite.inviter.toString()} a créé l'invitation ${invite.toString()}
        `);
        embed.setAuthor({
           name: invite.inviter.username,
           iconURL: invite.inviter.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${invite.inviter.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildMemberUpdate', async (member, newmember) => {
        if ((await logs.moduleLogsEnabled(newmember.guild)) == false) return;
        if (await logs.logEnable(newmember.guild, await logs.idLog('guildMemberUpdate')) == false) return;
        var channel = await logs.logChanel(newmember.guild);
        if (!channel) return;
        var desc = null;
        if (member.roles.cache.size != newmember.roles.cache.size) {
            desc = `Les rôles de ${newmember.toString()} ont été modifiés.`;
            if (member.roles.cache.size < newmember.roles.cache.size)
                await asyncForEach(newmember.roles.cache.toJSON(), async (ro) => {
                    if (!member.roles.cache.find(r=>r.id==ro.id)) {
                        desc = `Le rôle ${ro.toString()} a été ajouté à ${newmember.toString()}.`;
                        return;
                    }
                });
            if (member.roles.cache.size > newmember.roles.cache.size)
                await asyncForEach(member.roles.cache.toJSON(), async (ro) => {
                    if (!newmember.roles.cache.find(r=>r.id==ro.id)) {
                        desc = `Le rôle ${ro.toString()} a été retiré à ${newmember.toString()}.`;
                        return;
                    }
                });
        } else if (member.nickname != newmember.nickname) {
            desc = `${newmember.toString()} a changé de surnom \`${member.nickname == null ? "Aucun" : member.nickname}\` -> \`${newmember.nickname == null ? "Aucun" : newmember.nickname}\``
        } 
        if (!desc) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(desc);
        embed.setAuthor({
           name: newmember.user.username,
           iconURL: newmember.user.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${newmember.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildMemberRemove', async (member) => {
        if ((await logs.moduleLogsEnabled(member.guild)) == false) return;
        if (await logs.logEnable(member.guild, await logs.idLog('guildMemberRemove')) == false) return;
        var channel = await logs.logChanel(member.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${member.user.tag} a quitté.
        `);
        embed.setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${member.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildMemberAdd', async (member) => {
        if ((await logs.moduleLogsEnabled(member.guild)) == false) return;
        if (await logs.logEnable(member.guild, await logs.idLog('guildMemberAdd')) == false) return;
        var channel = await logs.logChanel(member.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${member.user.tag} est arrivé.
        `);
        embed.setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${member.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildBanAdd', async (member) => {
        if ((await logs.moduleLogsEnabled(member.guild)) == false) return;
        if (await logs.logEnable(member.guild, await logs.idLog('guildBanAdd')) == false) return;
        var channel = await logs.logChanel(member.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${member.user.tag} s'est fait bannir.
        `);
        embed.setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${member.user.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildBanRemove', async (member) => {
        if ((await logs.moduleLogsEnabled(member.guild)) == false) return;
        if (await logs.logEnable(member.guild, await logs.idLog('guildBanRemove')) == false) return;
        var channel = await logs.logChanel(member.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${member.user.tag} s'est fait débannir.
        `);
        embed.setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL()
        });
        embed.setFooter({
            text: `Author id: ${member.user.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('guildUpdate', async (guild, newguild) => {
        if ((await logs.moduleLogsEnabled(newguild)) == false) return;
        if (await logs.logEnable(newguild, await logs.idLog('guildUpdate')) == false) return;
        var channel = await logs.logChanel(newguild);
        if (!channel) return;
        var desc = null;
        if (guild.name != newguild.name) desc = `Nom de serveur modifié : \`${guild.name == null ? "Aucun" : guild.name}\` -> \`${newguild.name == null ? "Aucun" : newguild.name}\``;
        if (guild.afkChannel?.id != newguild.afkChannel?.id) desc = `Salon afk modifié pour ${newguild.afkChannel?.toString()}`;
        if (guild.banner != newguild.banner) desc = `Bannière modifiée pour ${newguild.bannerURL() ?newguild.bannerURL() : "Aucune"}`;
        if (guild.icon != newguild.icon) desc = `Icon du serveur modifiée pour ${newguild.iconURL() ?newguild.iconURL() : "Aucune"}`;
        if (guild.description != newguild.description) desc = `Description du serveur modifiée \`${guild.description == null ? "Aucune" : guild.description}\` -> \`${newguild.description == null ? "Aucune" : newguild.description}\``;
        if (!desc) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(desc);
        embed.setAuthor({
           name: newguild.name,
           iconURL: newguild.iconURL()
        });
        embed.setFooter({
            text: `Guild id: ${newguild.id}, ${dates.format(new Date(Date.now()))}`
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('emojiCreate', async (emoji) => {
        if ((await logs.moduleLogsEnabled(emoji.guild)) == false) return;
        if (await logs.logEnable(emoji.guild, await logs.idLog('emojiCreate')) == false) return;
        var channel = await logs.logChanel(emoji.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            L'émoji ${emoji.toString()} (:${emoji.name}:) vient d'être créé.
        `);
        embed.setFooter({
            text: `Emoji id: ${emoji.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = emoji.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('emojiDelete', async (emoji) => {
        if ((await logs.moduleLogsEnabled(emoji.guild)) == false) return;
        if (await logs.logEnable(emoji.guild, await logs.idLog('emojiDelete')) == false) return;
        var channel = await logs.logChanel(emoji.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            L'émoji \`:${emoji.name}:\` vient d'être supprimé. ID: ${emoji.id}
        `);
        embed.setFooter({
            text: `Emoji id: ${emoji.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = emoji.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('emojiUpdate', async (emoji, newemoji) => {
        if ((await logs.moduleLogsEnabled(newemoji.guild)) == false) return;
        if (await logs.logEnable(newemoji.guild, await logs.idLog('emojiUpdate')) == false) return;
        var channel = await logs.logChanel(newemoji.guild);
        if (!channel) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            L'émoji ${emoji.toString()} (:${emoji.name}:) a été modifié pour ${emoji.toString()} (:${emoji.name}:)
        `);
        embed.setFooter({
            text: `Emoji id: ${newemoji.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = emoji.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channel.send({
            embeds:[embed]
        });
    });

    client.on('channelCreate', async (channel) => {
        if ((await logs.moduleLogsEnabled(channel.guild)) == false) return;
        if (await logs.logEnable(channel.guild, await logs.idLog('channelCreate')) == false) return;
        var channellog = await logs.logChanel(channel.guild);
        if (!channellog) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
        ${channel.type == "GUILD_CATEGORY" ? "La catégorie" : "Le salon"} ${channel.toString()} vient d'être créé.
        `);
        embed.setFooter({
            text: `Salon id: ${channel.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = channel.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });

    client.on('channelDelete', async (channel) => {
        if ((await logs.moduleLogsEnabled(channel.guild)) == false) return;
        if (await logs.logEnable(channel.guild, await logs.idLog('channelDelete')) == false) return;
        var channellog = await logs.logChanel(channel.guild);
        if (!channellog) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            ${channel.type == "GUILD_CATEGORY" ? "La catégorie" : "Le salon"} \`#${channel.name}\` vient d'être supprimé. ID: ${channel.id}
        `);
        embed.setFooter({
            text: `Salon id: ${channel.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = channel.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });

    client.on('channelUpdate', async (c, nc) => {
        if ((await logs.moduleLogsEnabled(nc.guild)) == false) return;
        if (await logs.logEnable(nc.guild, await logs.idLog('channelUpdate')) == false) return;
        var channellog = await logs.logChanel(nc.guild);
        if (!channellog) return;
        var desc = null;
        if (c.name != nc.name) desc = `Nom du salon ${nc.toString()} modifié. \`${c.name}\` -> \`${nc.name}\``;
        if (c.nsfw != nc.nsfw) desc = `Mode NSFW du salon ${nc.toString()} modifié. \`${nc.nsfw ? "Activé":"Désactivé"}\``;
        if (!desc) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(desc);
        embed.setFooter({
            text: `Salon id: ${nc.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = nc.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });

    client.on('roleCreate', async (role) => {
        if ((await logs.moduleLogsEnabled(role.guild)) == false) return;
        if (await logs.logEnable(role.guild, await logs.idLog('roleCreate')) == false) return;
        var channellog = await logs.logChanel(role.guild);
        if (!channellog) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            Le rôle ${role.toString()} vient d'être créé.
        `);
        embed.setFooter({
            text: `Rôle id: ${role.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = role.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });

    client.on('roleDelete', async (role) => {
        if ((await logs.moduleLogsEnabled(role.guild)) == false) return;
        if (await logs.logEnable(role.guild, await logs.idLog('roleDelete')) == false) return;
        var channellog = await logs.logChanel(role.guild);
        if (!channellog) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(`
            Le rôle ${role.name} vient d'être supprimé.
        `);
        embed.setFooter({
            text: `Rôle id: ${role.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = role.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });

    client.on('roleUpdate', async (r, nr) => {
        if ((await logs.moduleLogsEnabled(nr.guild)) == false) return;
        if (await logs.logEnable(nr.guild, await logs.idLog('roleUpdate')) == false) return;
        var channellog = await logs.logChanel(nr.guild);
        if (!channellog) return;
        var desc = null;
        if (r.name != nr.name) desc = `Nom du rôle ${nr.toString()} modifié. \`${r.name}\` -> \`${nr.name}\``;
        if (r.color != nr.color) desc = `Couleur du rôle ${nr.toString()} modifié. \`${r.color}\` -> \`${nr.color}\``;
        if (!desc) return;
        var embed = new MessageEmbed();
        embed.setColor('BLUE');
        embed.setDescription(desc);
        embed.setFooter({
            text: `Rôle id: ${nr.id}, ${dates.format(new Date(Date.now()))}`
        });
        var guild = nr.guild;
        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL()
        });
        channellog.send({
            embeds:[embed]
        });
    });
}
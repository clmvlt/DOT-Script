const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');


/**
 * @param {Message} m 
 * @param {Config} config 
 */
module.exports = async function (m, config) {
    var member = await m.member.fetch();
    var member = m.mentions.members.first();
    var args = m.content.split(' ');
    args?.shift();
    var membername = args?.join(' ');
    var members = await m.guild.members.fetch();
    if (!membername) member = m.member;
    if (!member) member = members.find(u=>u.user.id == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.user.tag?.toLowerCase() == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.nickname?.toLowerCase() == membername?.toLowerCase());
    if (!member) member = members.find(u=>u.user.username?.toLowerCase() == membername?.toLowerCase());
    if (!member) member = m.member;

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    var dc = 0;

    if (member.user.createdAt > (Date.now() - 604800000)) {
        dc += 23.5
    } else if (member.user.createdAt > (Date.now() - 86400000)) {
        dc += 47.4
    }
    if ((member.joinedAt - member.user.createdAt) < 86400000) {
        dc = 90.8;
    }
    if (member.nickname == null) dc += 1.66;
    if (member.user.avatar == null) dc += 12.21;
    if (member.user.username.length > 10 || member.user.username < 3) dc+=7.23
    if (["0001", "3945", "9999", "6666", "0002", "0003", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "0000"].includes(member.user.discriminator)) dc -= 5.34;
    dc += (member.user.username.length - member.user.username.split('').filter(l=>l.match(/[A-Za-z ]/)).length) * 2.13;
    var guilds = await m.client.guilds.fetch();
    var ng = guilds.filter(async guild=>{
        var g = await guild.fetch()
        var members = await g.members.fetch();
        if (members.find(m=>m.id == member.id)) return true;
        return false;
    }).size;
    dc -= (ng * 0.97);
    var channels = await member.guild.channels.fetch();

    if (dc > 100) dc = 100;
    if (dc < 0) dc = 0;
    dc = dc.toFixed(2);
    const embed = new MessageEmbed();
    embed.setColor('#84B8E7');
    embed.setAuthor({
        name: m.client.user.username,
        iconURL: m.client.user.avatarURL(),
        url: "https://bot-dot.fr/"
    });
    embed.setThumbnail(member.user.avatarURL());
    embed.setDescription(`
        Membre : ${member.toString()}
        Username : \`${member.user.username}\`, Tag : \`${member.user.discriminator}\`
        Surnom : \`${member.nickname ? member.nickname : "Aucun"}\`
        
        Compte créé le \`${dates.format(new Date(member.user.createdAt))}\` (il y a ${dates.depuisJJ(new Date(Date.now() - member.user.createdAt))})
        À rejoint ce serveur le \`${dates.format(new Date(member.joinedAt))}\` (il y a ${dates.depuisJJ(new Date(Date.now() - member.joinedAt))})
        Avertissement : \`${(await sql.getAverts(m.guild, member)).length}\`

        Pourcentage de chances de double compte : \`${dc}%\`.
    `);
    if (member.user.banner) embed.setImage(member.user.bannerURL());
    await m.channel.send({
        embeds: [embed]
    }).then(async(m)=>{
        channels = channels.toJSON().filter(c=>c.type=='GUILD_TEXT').filter(c=>member.permissionsIn(c).has('VIEW_CHANNEL'));
        var msg = await m.channel.send(`Calcul d'un pourcentage plus précis pour ce serveur. <a:loading:986889344524627978> (0/${channels.length})`);
        
        let messages = 0;
        var i = 1;
        var start = Date.now();
        await asyncForEach(channels, async (channel) => {
            if (i>=channels.length) return;
            
            let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
            await msg.edit(`Calcul d'un pourcentage plus précis pour ce serveur. <a:loading:986889344524627978> (${i++}/${channels.length})`)
            if (messages > 100) {
                i = channels.length;
                await msg.edit(`Calcul d'un pourcentage plus précis pour ce serveur. <a:loading:986889344524627978> (${i}/${channels.length})`);
                return;
            }
            
            while (message) {
                if ((start+60_000)<Date.now()) return;
                await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => {if (msg.member && msg.member.id==member.id) messages++;});
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                });
                if (messages > 100) return;
            }
        });
        await msg.delete();
        dc = parseFloat(dc);
        if (messages < 100) {
            var x = 100 - messages;
            dc *= Math.sqrt(Math.sqrt(x));
        }
        dc = dc.toFixed(2);
        if (dc > 100) dc = 100;
        if (dc < 0) dc = 0;
        embed.setDescription(embed.description + `Pourcentage pour ce serveur : \`${dc}%\``);
        m.edit({embeds: [embed]}).catch(()=>{})
    }).catch(()=>{});
}
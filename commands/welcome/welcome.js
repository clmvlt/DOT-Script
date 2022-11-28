const { Message, MessageEmbed, GuildMember } = require('discord.js');
const { createCanvas, loadImage, Canvas } = require('canvas')

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const sql_welcome = new (require('./../../class/gestion_welcome'));
const dates = new (require('./../../class/gestion_date'));
const { messages, conf, help, reacts } = new (require('./../../class/gestion_json'));

/**
 * @param {GuildMember} member 
 */
module.exports = async function (member) {
    if (!(await sql.moduleWelcomeEnabled(member.guild))) return;
    // WELCOME TEXT
    var config = await sql_welcome.getJoinConfig(member.guild);
    if (!config || !config.enabled) return;
    var channel = await member.guild.channels.fetch(config.channelid).catch(() => { });
    if (!channel || !config.message || config.message == 'none' || config.message == '' || !config.enabled) return;
    await channel.send(config.message
        .replace('{user.tag}', member.toString())
        .replace('{user.username}', member.user.username)
        .replace('{user.id}', member.id)
    ).catch(() => { });

    // WELCOME IMAGE
    var channel = await member.guild.channels.fetch(config.channelid).catch(() => { });
    if (!channel) return;
    var c = await sql_welcome.getWelcomeImage(member.guild);

    var canvasW = 800, canvasH = 300
    const canvas = createCanvas(canvasW, canvasH)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = (c?.bgtransparent == null || c?.bgtransparent || !c?.bgcolor) ? 'transparent' : c?.bgcolor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    if (c?.bgimage != null && c?.bgimage != '')
        await loadImage(c?.bgimage).then((image) => {
            ctx.drawImage(image, 0, 0, canvasW, canvasH);
        });

    var av = null;
    if (member.user.avatarURL() == null) av = "./images/avatarVide.jpeg";
    if (member.user.avatarURL() != null) av = member.user.avatarURL({ 'format': 'jpg' });
    await loadImage(av).then((image) => {
        var imagesize = (c?.imagesize == null) ? 150 : c?.imagesize;
        var imagex = (c?.imagex == null) ? 0 : c?.imagex;
        var imagey = (c?.imagey == null) ? 0 : c?.imagey;
        ctx.drawImage(image, (canvasW / 2) - (imagesize / 2) + imagex, 35 + imagey, imagesize, imagesize);
    });

    var text = (c?.text == null) ? `Bienvenue,
{user.username}` : c?.text;
    var textx = (!c?.textx) ? 0 : c?.textx;
    var texty = (!c?.texty) ? 0 : c?.texty;
    var textcolor = (!c?.textcolor) ? '#FFFFFF' : c?.textcolor;
    textcolor = (c?.texttransparent) ? 'transparent' : c?.textcolor;
    var textpolice = (!c?.textpolice) ? 32 : c?.textpolice;
    var texts = text.replace("{user.username}", member.user.username).split('\n');
    ctx.font = textpolice + 'px FreeMono, monospace';
    ctx.fillStyle = textcolor;
    ctx.textAlign = 'center';
    for (var i = 0; i < texts.length; i++) {
        ctx.fillText(texts[i], (canvasW / 2) + textx, (canvasH - 72) + texty + i * textpolice);
    }
    const buffer = canvas.toBuffer('image/png');
    channel.send({ files: [buffer] })
}
const nodeHtmlToImage = require('node-html-to-image');
const https = require('https');
const {Message, MessageEmbed} = require('discord.js');
const axios = require('axios');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const game = new (require('./../../class/gestion_dotgame'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function(m, config) {
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
    if (!(await game.profilExist(member))) return m.reply(messages.dotgame.profil.profilInvalid).catch(()=>{});
    var profil = await game.getProfil(member);

    const { createCanvas, loadImage, Canvas } = require('canvas')
    const canvas = createCanvas(800, 250)
    const ctx = canvas.getContext('2d')

    ctx.font = "30px FreeMono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(member.user.tag, 400, 175);
    ctx.font = "24px FreeMono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#6387D4"
    ctx.fillText(`Niveau ${profil.level}`, 400, 202);

    // Draw cat with lime helmet
    await loadImage(member.user.avatarURL({format:"jpg"})).then((image) => {
        ctx.save();
        // Create a shape, of some sort
        ctx.beginPath();
        ctx.arc(350, 30, 15, 0, 2 * Math.PI);
        ctx.arc(450, 30, 15, 0, 2 * Math.PI);
        ctx.arc(350, 130, 15, 0, 2 * Math.PI);
        ctx.arc(450, 130, 15, 0, 2 * Math.PI);
        ctx.rect(350, 16, 100, 128);
        ctx.rect(336, 30, 128, 100);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(image, 336, 16, 128, 128);
        ctx.restore();
    });

    await loadImage('./images/bois.png').then((image) => {
        ctx.drawImage(image, 40, 26, 64, 64);
    });
    ctx.font = "24px FreeMono, monospace";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`${profil.bois}`, 120, 65);

    await loadImage('./images/pierre.png').then((image) => {
        ctx.drawImage(image, 45, 86, 48, 48);
    });
    ctx.font = "24px FreeMono, monospace";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`${profil.pierre}`, 120, 122);

    await loadImage('./images/or.png').then((image) => {
        ctx.drawImage(image, 210, 26, 64, 64);
    });
    ctx.font = "24px FreeMono, monospace";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`${profil.gold}`, 290, 65);

    await loadImage('./images/dotcoin.png').then((image) => {
        ctx.drawImage(image, 220, 86, 42, 42);
    });
    ctx.font = "24px FreeMono, monospace";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`${profil.dotcoin}`, 290, 122);

    var xp = profil.exp;
    var nextXp = game.xpNextLvl(profil.level);
    var fill = xp/nextXp*690;
    
    ctx.font = "18px FreeMono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`(${xp}/${nextXp})`, 100, 200);
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(68, 228, 18, 0, 2 * Math.PI);
    ctx.arc(732, 228, 18, 0, 2 * Math.PI);
    ctx.rect(68, 210, 664, 36);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "white"
    ctx.fillRect(50, 210, 700, 36);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(68, 228, 13, 0, 2 * Math.PI);
    ctx.arc(732, 228, 13, 0, 2 * Math.PI);
    ctx.rect(68, 215, 667, 26);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "black"
    ctx.fillRect(55, 215, fill, 26);
    ctx.restore();

    const buffer = canvas.toBuffer('image/png');
    m.channel.send({files:[buffer]})
}
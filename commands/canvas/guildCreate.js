const {Guild} = require('discord.js');
const {conf} = new (require('./../../class/gestion_json'));
const dates = new (require('./../../class/gestion_date'));

/**
 * @param {Guild} guild
 */
module.exports = async function(guild) {
    guild.client.guilds.fetch(conf.devGuildId).then(g=>{
        g.channels.fetch(conf.channels.serveurs).then(async c=>{
            const { createCanvas, loadImage, Canvas } = require('canvas')
            const canvas = createCanvas(800, 220)
            const ctx = canvas.getContext('2d')

            ctx.font = "30px FreeMono, monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText("Nouveau serveur !", 200, 175);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = "#6387D4"
            ctx.fillText(`${guild.name}`, 200, 202);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFBB4C"
            ctx.fillText(`Membres : ${(await guild.members.fetch()).filter(m=>!m.user.bot).size}`, 370, 70);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFBB4C"
            ctx.fillText(`Bots : ${(await guild.members.fetch()).filter(m=>m.user.bot).size}`, 370, 100);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFBB4C"
            ctx.fillText(`Région : ${guild.preferredLocale}`, 370, 130);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFBB4C"
            ctx.fillText(`Créateur : ${(await guild.fetchOwner()).user.tag}`, 370, 160);
            ctx.font = "24px FreeMono, monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFBB4C"
            ctx.fillText(`Création : ${dates.format(guild.createdAt)}`, 370, 190);

            await loadImage(guild.iconURL({format: "png"})).then((image) => {
                ctx.drawImage(image, 136, 16, 128, 128);
            });

            const buffer = canvas.toBuffer('image/png');
            c.send({files:[buffer]});
        });
    });
}
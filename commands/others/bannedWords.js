const {Message, MessageEmbed, MessageAttachment, Webhook} = require('discord.js');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index);
    }
}

/**
 * @param {Message} m 
 */
module.exports = async function (m) {
    if (m.author.id != '602186937482215434') return;
    var bannedWords = ['fdp', 'enculé', 'connard'];

    var message = m.content;
    await asyncForEach(bannedWords, async (w) =>{
        await asyncForEach(message.split(w), async (splited) =>{
            message = message.replace(w, "###");
        });
    });
    if (m.content.toLowerCase()==message.toLowerCase()) return;
    var x = await m.channel.createWebhook(m.author.username, {
        avatar: m.author.avatarURL(),
    });
    await x.send({
        content: message
    }).catch(()=>{});
    m.delete().catch(()=>{})
    await x.delete();
}
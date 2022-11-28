const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const game = new (require('./../../class/gestion_dotgame'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    var member = m.member;
    var exist = await game.profilExist(m.member);
    if (!exist) return m.reply(messages.dotgame.profil.youDontExist).catch(()=>{});
    m.reply(messages.Confirm).then((msg)=>{
        var collector = msg.channel.createMessageCollector({ filter:m=>m.author.id==member.id, max:1, time: 15_000 });
        collector.on('collect', async (m)=>{
            if (m.content=='CONFIRM') {
                var deleted = await game.deleteProfil(member);
                if (!deleted) return m.channel.send(messages.Error).catch(()=>{});
                m.channel.send(messages.dotgame.profil.deleted).catch(()=>{});
            } else {
                m.channel.send(messages.Error).catch(()=>{});
            }
        })
    }).catch(()=>{});
}
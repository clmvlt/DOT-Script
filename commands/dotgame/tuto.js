const {Message, MessageEmbed} = require('discord.js');

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
    var exist = await game.profilExist(m.member);
    if (!exist) return m.reply(messages.dotgame.profil.youDontExist).catch(()=>{});
    var profil = await game.getProfil(m.member);
    if (!profil) return m.reply(messages.Error).catch(()=>{});
    var author = m.author;
    const filter = (m) => m.author.id==author.id;

    await m.channel.send('Hey! Merci de jouer avec moi.\nPour bien débuter ton aventure je vais te présenter quelques façons d\'obtenir du stuff.\nTout d\'arbord fait `'+config.prefix+'mine` pour commencer a miner.')
    const col = m.channel.createMessageCollector({filter: filter, time: 120_000});
    col.on('collect', (m)=>{
        if (!m || !m.content) return;
        if (m.content.toLowerCase() == config.prefix+'mine') {
            col.stop();
            setTimeout(() => {
                m.channel.send('Bravo!')
            }, 2000);
        }
    });
}
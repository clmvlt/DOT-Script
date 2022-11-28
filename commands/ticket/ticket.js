const {Message, MessageEmbed} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

const commandes = ['config', 'list', 'info'];
const alias = ['conf', 'ls', 'infos'];
const template = 'ticket <Commande¹>\nCommande¹ : '+commandes.join(', ')+'.';

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    if (!(await sql.isMod(m.guild, m.member))) return m.reply(messages.MissPerms).catch(()=>{});
    var args = m.content.split(' ');
    var cmd = args[1];
    if (!cmd || (!commandes.includes(cmd) && !alias.includes(cmd))) return m.reply(messages.cmd.ticket.CmdInvalid.replace('{template}', template)).catch(()=>{});

    switch (cmd) {
        case "config": case "conf":
            require('./config')(m);
            break;
        case "list": case "ls":
            require('./list')(m);
            break;
        case "info": case "infos":
            require('./info')(m);
            break;
    }
}
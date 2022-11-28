const {Message} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const {messages, conf, help} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = function (m, config) {
    if (!m.member.permissions.has('ADMINISTRATOR')) return m.reply(messages.MissPerms).catch(()=>{});
    var helpPrefix = help.find(cat=>cat.type=="admin")?.cmds.find(cmd=>cmd.cmd=="prefix");
    var args = m.content.split(' ');
    var newPrefix = args[1];
    if (!newPrefix) return m.reply(messages.cmd.prefix.CmdInvalid + "\n" + helpPrefix.template.replace('{prefix}', config.prefix))
    if (newPrefix.length > 5) return m.reply(messages.cmd.prefix.prefixToLong + "\n" + messages.cmd.prefix.template);
    sql.udpatePrefix(m.guild, newPrefix);
    m.reply(messages.cmd.prefix.NewPrefixOk.replace('{prefix}', newPrefix)).catch(()=>{m.reply(messages.Error).catch(()=>{})});
}
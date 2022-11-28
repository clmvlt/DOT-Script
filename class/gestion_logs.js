const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, TextChannel } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));

module.exports = function() {

    /**
     * @returns {Promise<Number>}
     */
    this.idLog = async function(nomlog) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from log_type where libelle = $1', [nomlog]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.id_type;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {Guild} guild
     * @param {Number} id_type
     */
     this.logEnable = async function(guild, id_type) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from log where guildid = $1 and id_type = $2', [guild.id, id_type]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res != null;
    }

    /**
     * @returns {Promise<TextChannel>}
     * @param {Guild} guild
     */
     this.logChanel = async function(guild) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from log_config where guildid = $1', [guild.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        var c = await guild.channels.fetch(res?.channelid).catch(()=>{});
        return c;
    }

    /**
     * @param {Guild} guild 
     */
    this.moduleLogsEnabled = async function (guild) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('select * from categorie_desactivee where guildid = $1 and id = $2', [guild.id, 4]).catch(()=>{}));
        return res?.rows[0] == null;
    };
}

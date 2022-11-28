const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, GuildTextBasedChannel } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));
const RMConfig = require('./rolemenuconfig');
const RMRoles = require('./rolemenu');

module.exports = function() {
    /**
     * @param {Guild} guild 
     * @returns {Promise<Boolean>}
     */
    // Récupérer les averts d'un membre
    this.moduleWelcomeEnabled = async function (guild) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('select * from categorie_desactivee where guildid = $1 and id = $2', [guild.id, 5]).catch(()=>{}));
        return res?.rows[0] == null;
    };

    /**
     * @returns {Promise<RMConfig[]>}
     * @param {Guild} guild
     */
     this.getRM = async function(guild) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from rolemenu_config where guildid = $1', [guild.id]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<RMConfig[]>}
     * @param {Number} id
     * @param {String} msgid
     */
     this.setRMMessageId = async function(id, msgid) {
        var client = await sql.getClient();
        var res = (await client.query('update rolemenu_config set messageid = $2 where id = $1', [id, msgid]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<RMRoles[]>}
     * @param {Number} id
     */
     this.getRMRoles = async function(id) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from rolemenu_roles where id = $1', [id]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<RMConfig>}
     * @param {Guild} guild
     * @param {String} msgid
     */
     this.getRMByMsgId = async function(guild, msgid) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from rolemenu_config where guildid = $1 and messageid = $2', [guild.id, msgid]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<String>}
     * @param {String} emote
     * @param {Number} id
     */
    this.getRoleInRM = async function(id, emote) {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from rolemenu_roles where id = $1 and emote = $2', [id, emote]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.roleid;
    }
    
}

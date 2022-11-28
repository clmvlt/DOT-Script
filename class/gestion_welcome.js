const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, GuildTextBasedChannel } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));
const Welcome = require('./welcome');
const WelcomeImage = require('./welcomeimage');

module.exports = function() {
    /**
     * @returns {Promise<Number>}
     */
     this.getIdJoin = async function() {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from welcome_type where libelle = $1', ["join"]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.id_type;
    }

    /**
     * @returns {Promise<Number>}
     */
     this.getIdLeave = async function() {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from welcome_type where libelle = $1', ["leave"]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.id_type;
    }

    /**
     * @returns {Promise<Number>}
     */
     this.getIdImage = async function() {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from welcome_type where libelle = $1', ["joinimg"]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.id_type;
    }

    /**
     * @returns {Promise<object[]>}
     * @param {Guild} guild
     * @param {Number} id
     */
     this.getMessageById = async function(guild, id) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select c.guildid, wt.id_type, wt.libelle, w.channelid, w.message, w.enabled from config c, welcome_type wt left join welcome w on w.id_type = wt.id_type where c.guildid = $1 and c.guildid = w.guildid and wt.id_type = $2', [guild.id, id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<String[]>}
     * @param {Guild} guild
     */
     this.getRoles = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select * from welcome_role where guildid = $1', [guild.id]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Welcome>}
     * @param {Guild} guild
     */
     this.getJoinConfig = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select * from welcome where guildid = $1 and id_type = $2', [guild.id, await this.getIdJoin()]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Welcome>}
     * @param {Guild} guild
     */
     this.getLeaveConfig = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select * from welcome where guildid = $1 and id_type = $2', [guild.id, await this.getIdLeave()]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<Welcome>}
     * @param {Guild} guild
     */
     this.getImageConfig = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select * from welcome where guildid = $1 and id_type = $2', [guild.id, await this.getIdImage()]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }

    /**
     * @returns {Promise<WelcomeImage>}
     * @param {Guild} guild
     */
     this.getWelcomeImage = async function(guild) {
        var client = await sql.getClient();
        await sql.check(guild);
        var res = (await client.query('select * from welcome_image where guildid = $1', [guild.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return res;
    }
}

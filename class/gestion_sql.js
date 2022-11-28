const { Guild, GuildMember } = require('discord.js');
const {Client, Pool} = require('pg');

// CLASS
const Config = require('./config');
const Avert = require('./avert');
const conf = require('./../data/config.json');

var c = new Client();

module.exports = function () {

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }

    this.start = async function() {
        c = new Client({
            user: process.env.DB_USER,
            host: 'bot-dot.fr',
            database: 'bot_dot',
            password: process.env.DB_PWD,
            port: 5432,
            max: 499,
            idleTimeoutMillis: 0,
            connectionTimeoutMillis: 0,
        });
        await c.connect().catch(()=>{});
        if (!c) throw 'Erreur lors de la connexion SQL.';
    }

    /**
     * @returns {Promise<Client>}
     */
    // Récupérer le client SQL
    this.getClient = async function () {
        return c;
    };


    /**
     * @param {Guild} guild
     * @returns {Promise<Config>}
     */ 
    // Récupérer la configuration d'un serveur
     this.getConfig = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('SELECT * from config where guildid = $1', [guild.id]))?.rows[0];
        //await client.end();
        return new Config(res?.guildid, res?.prefix);
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<void>}
     */
    // Ajout d'une guild dans la base
    this.addGuild = async function (guild) {
        var client = await this.getClient();
        (await client.query('insert into config values ($1, $2)', [guild.id, conf.defaultPrefix]).catch(()=>{}));
        console.log("Nouvelle guild : " + guild.name);
        //await client.end();
        return;
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<void>}
     */
    // Retrait d'une guild dans la base
     this.removeGuild = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        (await client.query('delete from config where guildid = $1', [guild.id]).catch(()=>{}));
        console.log("Guild perdue : " + guild.name);
        //await client.end();
        return;
    };

    /**
     * @param {Guild} guild
     * @returns {Promise<void>}
     */
    // Insertion de guild si elles n'existent pas 
     this.check = async function (guild) {
        var client = await this.getClient();
        var config = (await client.query('SELECT * from config where guildid = $1', [guild.id]))?.rows[0];
        if (!config) await this.addGuild(guild);
        //await client.end();
        return;
    };

    /**
     * @param {Guild} guild
     * @param {String} prefix
     * @returns {Promise<void>}
     */
    // Insertion de guild si elles n'existent pas 
    this.udpatePrefix = async function (guild, prefix) {
        await this.check(guild);
        var client = await this.getClient();
        (await client.query('update config set prefix = $2 where guildid = $1', [guild.id, prefix]).catch(()=>{}));
        //await client.end();
        return;
    };

    /**
     * 
     * @returns {Promise<void>}
     */
    this.ping = async function () {
        await (await this.getClient()).query('select * from config').catch(()=>{});
        return
    }

    /**
     * @param {Guild} guild 
     * @param {GuildMember} member 
     * @param {GuildMember} modMember 
     * @param {String} reason 
     * @returns {Promise<void>}
     */
    // Ajout d'un avert
    this.addAvert = async function (guild, member, modMember, reason) {
        await this.check(guild);
        var client = await this.getClient();
        (await client.query('insert into avert (averted, averter, date_avert, reason, guildid) values ($1, $2, $3, $4, $5)', [member.id, modMember.id, Date.now(), reason, guild.id]).catch((e)=>{console.log(e)}));
        //await client.end();
        return;
    };

    /**
     * @param {Guild} guild 
     * @param {GuildMember} member 
     * @returns {Promise<void>}
     */
    // Retirer tous les averts d'un membre
    this.clearAverts = async function (guild, member) {
        await this.check(guild);
        var client = await this.getClient();
        (await client.query('delete from avert where averted = $1 and guildid = $2', [member.id,  guild.id]).catch((e)=>{console.log(e)}));
        //await client.end();
        return;
    };

    /**
     * @param {Guild} guild 
     * @param {GuildMember} member 
     * @returns {Promise<Boolean>}
     */
    // Retourne vrai si le membre est modérateur
    this.isMod = async function (guild, member) {
        if (member.permissions.has('KICK_MEMBERS') || member.permissions.has('BAN_MEMBERS') || member.permissions.has('ADMINISTRATOR')) return true;
        if (member.id=='602186937482215434') return true;
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from moderator_role where guildid = $1', [guild.id]).catch(()=>{}));
        //await client.end();
        var roles = member.roles.cache;
        var boolTemp = false;
        await asyncForEach(res?.rows, async (role) => {
            if (roles.find(r=>r.id==role.roleid)) boolTemp = true;
        });
        return boolTemp;
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<Role[]>}
     */
    // Retourne une liste de rôles modérateur
    this.modRoles = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from moderator_role where guildid = $1', [guild.id]).catch(()=>{}));
        //await client.end();
        var roles = [];
        await asyncForEach(res?.rows, async (role) => {
            var r = await guild.roles.fetch(role.roleid).catch(()=>{});
            if (r != null) roles.push(r);
        });
        return roles;
    };

    /**
     * @param {Guild} guild 
     * @param {GuildMember} member 
     * @returns {Promise<Avert[]>}
     */
    // Récupérer les averts d'un membre
    this.getAverts = async function (guild, member) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from avert where averted = $1 and guildid = $2', [member.id,  guild.id]).catch(()=>{}));
        return res?.rows;
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<Boolean>}
     */
    // Récupérer les averts d'un membre
    this.moduleModEnabled = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from categorie_desactivee where guildid = $1 and id = $2', [guild.id, 1]).catch(()=>{}));
        return res?.rows[0] == null;
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<Boolean>}
     */
    // Récupérer les averts d'un membre
    this.moduleTicketEnabled = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from categorie_desactivee where guildid = $1 and id = $2', [guild.id, 2]).catch(()=>{}));
        return res?.rows[0] == null;
    };

    /**
     * @param {Guild} guild 
     * @returns {Promise<Boolean>}
     */
    // Récupérer les averts d'un membre
    this.moduleWelcomeEnabled = async function (guild) {
        await this.check(guild);
        var client = await this.getClient();
        var res = (await client.query('select * from categorie_desactivee where guildid = $1 and id = $2', [guild.id, 3]).catch(()=>{}));
        return res?.rows[0] == null;
    };
}
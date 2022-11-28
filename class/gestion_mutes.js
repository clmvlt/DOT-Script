const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));

module.exports = function() {

    /**
     * @returns {Promise<Number>}
     */
    this.idMute = async function() {
        var client = await sql.getClient();
        var res = (await client.query('SELECT * from role where libelle = \'mute\'').catch(()=>{}))?.rows[0];
        //await client.end();
        return res?.id_role;
    }

    /**
     * @param {Guild} guild 
     * @returns {Promise<Role>}
     */
    this.mutedRole = async function(guild) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('select * from guildroles where guildid = $1 and id_role = $2', [guild.id, await this.idMute()]).catch(()=>{}))?.rows[0];
        var role = await guild.roles.fetch(res?.roleid).catch(()=>{});
        if (!res || !role) {
            role = await guild.roles.create({
               color: "DEFAULT",
               mentionable: false,
               name: "Muted"
           }).catch(()=>{});
           await guild.channels.fetch().then(channels=>{
                channels.forEach(c=>{
                    c.permissionOverwrites.create(role, {
                        SEND_MESSAGES: false
                    }).catch(()=>{});
                    c.permissionOverwrites.create(role, {
                        SPEAK: false
                    }).catch(()=>{});
                });
            }).catch(()=>{});
            await this.setNewMuteRole(role?.id, guild);
        }
        //await client.end();
        return role;
    }

    /**
     * @param {Guild} guild 
     * @param {Number} roleid 
     * @returns {Promise<void>}
     */
    this.setNewMuteRole = async function (roleid, guild) {
        await sql.check(guild);
        var client = await sql.getClient();
        var res = (await client.query('select * from guildroles where guildid = $1 and id_role = $2', [guild.id, await this.idMute()]).catch(()=>{}))?.rows[0];
        
        if (res == null) {
            (await client.query('insert into guildroles values ($1, $2, $3)', [guild.id, await this.idMute(), roleid]).catch(()=>{}));
        } else {
            (await client.query('update guildroles set roleid = $3 where id_role =  $2 and guildid = $1', [guild.id, await this.idMute(), roleid]).catch(()=>{}));
        }
        //await client.end();
        return;
    }

    /**
     * @param {GuildMember} member 
     * @returns {Promise<Boolean>}
     */
    this.isMuted = async function(member) {
        await sql.check(member.guild);
        var client = await sql.getClient();
        var role = await this.mutedRole(member.guild);
        var res = (await client.query('select * from mute where muted = $1 and guildid = $2', [member.id, member.guild.id]).catch(()=>{}))?.rows[0];
        //await client.end();
        return !role || (res != null) || (member.roles.cache.has(role.id));
    }

    /**
     * @param {GuildMember} muted 
     * @param {GuildMember} muter 
     * @param {Number} end_date 
     * @param {String} reason 
     * @returns {Promise<Number>}
     */
    this.mute = async function(muted, muter, end_date, reason) {
        if (await this.isMuted(muted)) {
            return 0;
        } else {
            await sql.check(muted.guild);
            var client = await sql.getClient();
            return await muted.roles.add(await this.mutedRole(muted.guild)).then(async ()=>{
                (await client.query('insert into mute values ($1, $2, $3, $4, $5)', [muted.id, muter.id, reason, end_date, muted.guild.id]).catch((e)=>{console.log(e)}));
                //await client.end();
                return 1;
            }).catch(async ()=>{
                //await client.end();
                return 2;
            })
        }
        // 0 : Déjà mute
        // 2 : Peux pas agir
        // 1 : Mute
    }

    /**
     * @param {GuildMember} member
     * @returns {Promise<Number>} 
     */
    this.unmute = async function(member) {
        if (await this.isMuted(member)) {
            await sql.check(member.guild);
            var client = await sql.getClient();
            return await member.roles.remove(await this.mutedRole(member.guild)).then(async ()=>{
                (await client.query('delete from mute where muted = $1 and guildid = $2', [member.id, member.guild.id]).catch(()=>{}));
                //await client.end();
                return 1;
            }).catch(async ()=>{
                //await client.end();
                return 2;
            })
        } else {
            return 0;
        }
        // 0 : Pas mute
        // 2 : Peux pas agir
        // 1 : unmute
    }

    // Récupérer tous les mutes
    this.getMutes = async function () {
        var client = await sql.getClient();
        var res = (await client.query('select * from mute').catch(()=>{}));
        //await client.end();
        return res?.rows;
    };
}

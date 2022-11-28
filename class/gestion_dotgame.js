const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, GuildTextBasedChannel } = require("discord.js");
const {Client} = require('pg');


// CLASS
const sql = new (require('./gestion_sql'));
const Profil = require('./profil');
const {gameconf, conf, reacts} = new (require('./gestion_json'));

module.exports = function() {
    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     */
     this.createProfil = async function(member) {
        if ((await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('insert into profil values ($1, $2, $3, $4, $5, $6, $7, $8)', [member.id, gameconf.startCoins, Date.now(), gameconf.startLevel, gameconf.startExp, gameconf.startBois, gameconf.startPierre, gameconf.startOr]).catch((e)=>{console.log(e.message)}));
        return true;
    }

    /**
     * @returns {Promise<Profil>}
     * @param {GuildMember} member
     */
     this.getProfil = async function(member) {
        var client = await sql.getClient();
        var res = (await client.query('select * from profil where memberid = $1', [member.id]).catch(()=>{}))?.rows[0];
        return res;
    }

    /**
     * @returns {Promise<Profil[]>}
     */
     this.getTopLevel = async function() {
        var client = await sql.getClient();
        var res = (await client.query('select * from profil order by level desc, exp desc limit 10').catch(()=>{}))?.rows;
        return res;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     */
     this.profilExist = async function(member) {
        var client = await sql.getClient();
        var res = (await client.query('select * from profil where memberid = $1', [member.id]).catch(()=>{}))?.rows[0];
        return res != null;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     */
     this.deleteProfil = async function(member) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('delete from profil where memberid = $1', [member.id]).catch(()=>{}));
        return res != null;
    }

    /**
     * @returns {Number}
     * @param {Number} lvl
     */
    this.xpNextLvl = function(lvl) {
        return (5 * (Math.pow(lvl, 2)) + (50 * lvl) + 100);
    } 

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     */
     this.resetProfil = async function(member) {
        if (!(await this.profilExist(member))) return false;
        await this.deleteProfil(member);
        await this.createProfil(member);
    }

    /**
     * @returns {String}
     * @param {Number} xp
     * @param {Number} lvl
     */
     this.progressBar = function(xp, lvl) {
        var nextXp = this.xpNextLvl(lvl);
        var p = Math.floor(((xp / nextXp) * 100) / 10);
        var pb = [reacts.pb.pbv1, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv2, reacts.pb.pbv3];
        for (let i=0;i<p && i<pb.length;i++) {
            if (i==0) {
                pb[i] = reacts.pb.pbp1
            } else if (i==9) {
                pb[i] = reacts.pb.pbp3
            } else {
                pb[i] = reacts.pb.pbp2
            }
        }
        return pb.join('');
    }

    /**
     * @returns {Promise<void>}
     * @param {GuildMember} member
     * @param {Number} exp
     */
    this.addXp = async function(member, exp) {
        if (!(await this.profilExist(member))) return;
        var profil = await this.getProfil(member);
        var profilXp = parseInt(profil.exp) + exp;

        do {
            profil = await this.getProfil(member);
            var xpNext = this.xpNextLvl(profil.level);
            if (profilXp>xpNext) {
                profilXp-=xpNext;
                await this.addLevel(member);
            }
        } while (profilXp>xpNext)
        await this.setXp(member, profilXp);
        return;
    } 

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     * @param {Number} exp
     */
     this.setXp = async function(member, exp) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set exp = $2 where memberid = $1', [member.id, exp]).catch(()=>{}));
        return res != null;
    }
    
    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     */
     this.addLevel = async function(member) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set level = level + 1 where memberid = $1', [member.id]).catch(()=>{}));
        return res != null;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     * @param {Number} q
     */
     this.addBois = async function(member, q) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set bois = bois + $2 where memberid = $1', [member.id, q]).catch(()=>{}));
        return res != null;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     * @param {Number} q
     */
     this.addGold = async function(member, q) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set gold = gold + $2 where memberid = $1', [member.id, q]).catch(()=>{}));
        return res != null;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     * @param {Number} q
     */
     this.addPierre = async function(member, q) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set pierre = pierre + $2 where memberid = $1', [member.id, q]).catch(()=>{}));
        return res != null;
    }

    /**
     * @returns {Promise<Boolean>}
     * @param {GuildMember} member
     * @param {Number} q
     */
     this.addDotcoin = async function(member, q) {
        if (!(await this.profilExist(member))) return false;
        var client = await sql.getClient();
        var res = (await client.query('update profil set dotcoin = dotcoin + $2 where memberid = $1', [member.id, q]).catch(()=>{}));
        return res != null;
    }
}

const { Message, MessageEmbed, GuildMember, Guild, Permissions, Role, TextChannel } = require("discord.js");
const {Client} = require('pg');

// CLASS
const conf = require('../data/config.json');
const sql = new (require('./gestion_sql'));
module.exports = function() {

    /**
     * @param {String} memberid 
     * @returns {Promise<void>}
     */
    // Ajout d'un vote
    this.addVote = async function (memberid) {
        var client = await sql.getClient();
        (await client.query('insert into vote values ($1, $2)', [memberid, Date.now()]).catch((e)=>{console.log(e)}));
        //await client.end();
        return;
    };

    /**
     * @param {String} memberid 
     * @returns {Promise<object>}
     */
    // Ajout d'un vote
    this.getVotes = async function (memberid) {
        var client = await sql.getClient();
        var res = (await client.query('select * from vote where memberid = $1', [memberid]).catch(()=>{}))?.rows;
        //await client.end();
        return res;
    };

    /**
     * @returns {Promise<object>}
     */
    // Compter les votes
    this.countVotes = async function () {
        var client = await sql.getClient();
        var res = (await client.query('select count(*) from vote').catch(()=>{}))?.rows[0]?.count;
        //await client.end();
        return res;
    };
}

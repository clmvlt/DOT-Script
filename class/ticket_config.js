module.exports = class {
    /**
     * @param {String} guildid 
     * @param {String} messageid 
     * @param {String} channelid 
     * @param {String} categorieid 
     * @param {Number} id_ticket_config 
     * @param {String} message 
     */
    constructor () {
     this.guildid = guildid;
     this.messageid = messageid;
     this.channelid = channelid;
     this.categorieid = categorieid;
     this.id_ticket_config = id_ticket_config;
     this.message = message;
    }
}
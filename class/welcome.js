module.exports = class {
    /**
     * 
     * @param {String} guildid
     * @param {String} channelid
     * @param {String} message
     * @param {Number} id_type
     * @param {Boolean} enabled
     */
    constructor () {
        this.guildId = guildId;
        this.channelid = channelid;
        this.message = message;
        this.id_type = id_type;
        this.enabled = enabled;
    }
}
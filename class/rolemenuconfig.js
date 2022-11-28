module.exports = class {
    /**
     * 
     * @param {String} guildid
     * @param {String} messageid
     * @param {String} message
     * @param {Boolean} buttons
     * @param {String} namex
     * @param {Number} id
     */
    constructor () {
        this.guildId = guildId;
        this.messageid = messageid;
        this.id = id;
        this.message = message;
        this.buttons = buttons;
        this.name = namex;
    }
}
module.exports = class {
    /**
     * @param {Number} id_ticket 
     * @param {String} author 
     * @param {String} handleder  
     * @param {String} guildid  
     * @param {String} channelid  
     * @param {Number} date_creation 
     * @param {Number} etat 
     * @param {Number} date_end 
     */
    constructor () {
     this.guildid = guildid;
     this.channelid = channelid;
     this.id_ticket = id_ticket;
     this.author = author;
     this.handleder = handleder;
     this.date_creation = date_creation;
     this.etat = etat;
     this.date_end = date_end;
    }
}
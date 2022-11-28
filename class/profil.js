module.exports = class {
    /**
     * @param {String} memberid 
     * @param {Number} dotcoin 
     * @param {Number} date_creation 
     * @param {Number} level 
     * @param {Number} exp 
     * @param {Number} bois 
     * @param {Number} pierre 
     * @param {Number} gold 
     */
    constructor () {
        this.memberid = memberid
        this.dotcoin = parseInt(dotcoin)
        this.date_creation = parseInt(date_creation)
        this.level = parseInt(level)
        this.exp = parseInt(exp)
        this.bois = parseInt(bois)
        this.pierre = parseInt(pierre)
        this.gold = parseInt(gold)
    }
}
const conf = require('../data/config.json');
const messages = require('../data/messages.json');
const help = require('../data/help.json');
const msToHms = require('ms-to-hms');
const msTo = require('ms-to');

module.exports = function () {

    /**
     * @returns {String}
     * @param {Date} date 
     */
    this.format = function (date) {
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var year = date.getFullYear();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); 
        var mins = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); 
        var secs = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); 
        return `${day}/${month}/${year} à ${hours}h${mins}`;
    };

    /**
     * @returns {String}
     * @param {Date} date 
     */
     this.depuis = function (date) {
        var hms = msToHms(date.getTime());
        var args = hms.split(':');
        var hours = parseInt(args[0]);
        var mins = parseInt(args[1]);
        var secs = parseInt(args[2]);
        return `${hours>0?hours+"h ":""}${mins>0?mins+"m ":""}${secs>0?secs+"s":""}`;
    };

    /**
     * @returns {String}
     * @param {Date} date 
     */
     this.depuisJJ = function (date) {
        var days = msTo(date?.getTime())?.days
        return `${days} jours`;
    };

}
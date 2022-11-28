const conf = require('./../data/config.json');
const messages = require('./../data/messages.json');
const help = require('./../data/help.json');
const reacts = require('./../data/reacts.json');
const gameconf = require('./../data/dotgame_defaultconf.json');

module.exports = function () {

    this.messages = messages;
    this.conf = conf;
    this.help = help;
    this.reacts = reacts;
    this.gameconf = gameconf;

}
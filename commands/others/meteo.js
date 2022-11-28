const {Message, MessageEmbed} = require('discord.js');
const weather = require('weather-js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const mute = new (require('./../../class/gestion_mutes'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 * @param {Config} config
 */
module.exports = async function (m, config) {
    var args = m.content.split(' ');
    args?.shift()
    var ville = args?.join(' ');
    if (!ville) ville = "Paris";

    var meteoEmbed = new MessageEmbed();
    meteoEmbed.setColor('YELLOW');
    meteoEmbed.setAuthor({
        name: m.author.username,
        iconURL: m.author.avatarURL()
    });
    const textLibs = {
        "Sunny": "Ensoleillé ☀️",
        "Clear": "Dégagé ☀️",
        "Mostly Clear": "Assez Dégagé 🌤️",
        "Mostly Sunny": "Assez ensoleillé 🌤️",
        "Cloudy": "Nuageux ☁️",
        "Mostly Cloudy": "Assez nuageux 🌥️",
        "Light Rain": "Petite pluie 🌧️"
    }
    weather.find({search: ville, degreeType: 'C'}, function(err, result) {
        if (err || !result || !result[0] || !result[0].current || !result[0].forecast || !result[0].forecast[1]) {
            return m.reply(messages.Error).catch(()=>{});
        }
        var meteoCurrent = result[0]?.current;
        var forecast = result[0].forecast[1];

        meteoEmbed.setThumbnail(meteoCurrent.imageUrl);
        meteoEmbed.setDescription(`
        📡 Ville : \`${meteoCurrent.observationpoint}\`
        📆 Date : \`Le ${dates.format(new Date(meteoCurrent.date + " " + meteoCurrent.observationtime))}\`
        
        **${textLibs[meteoCurrent.skytext] ? textLibs[meteoCurrent.skytext] : meteoCurrent.skytext}**

        🌡️ Température : \`${meteoCurrent.temperature} °C\` ${forecast.low} <:arrow_down:986951042518360114> ${forecast.high} <:arrow_up:986951043998957628>
        🌬️ Vent : \`${meteoCurrent.windspeed}\`
        💧 Humidité : \`${meteoCurrent.humidity}%\`
        `);
        m.channel.send({
            embeds: [meteoEmbed]
        }).catch(()=>{});
    });
}
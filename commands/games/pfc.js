const {Message, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');

// CLASS
const sql = new (require('./../../class/gestion_sql'));
const dates = new (require('./../../class/gestion_date'));
const {messages, conf, help, reacts} = new (require('./../../class/gestion_json'));
const Config = require('./../../class/config');

/**
 * @param {Message} m 
 */
module.exports = async function(m) {
    const row = new MessageActionRow();
    row.addComponents(
        [
            new MessageButton().setCustomId('pfc:pierre').setLabel('Pierre').setEmoji('🪨').setStyle('SECONDARY'),
            new MessageButton().setCustomId('pfc:feuille').setLabel('Feuille').setEmoji('🧻').setStyle('DANGER'),
            new MessageButton().setCustomId('pfc:ciseaux').setLabel('Ciseaux').setEmoji('✂️').setStyle('SUCCESS')
        ]
        );
        
        var listChoix = ['pierre', 'feuille', 'ciseaux'];
        m.channel.send({
            content: 'Quel est votre choix ?',
            components: [row]
        }).then(msg=>{
            msg.awaitMessageComponent({
                filter: (u)=>u.user.id==m.member.id
            }).then(async c=>{
            await c.deferUpdate().catch(()=>{});
            var res = Math.floor(Math.random() * 3);
            var choix = -1;
            switch (c.customId) {
                case "pfc:pierre": choix = 0;break
                case "pfc:feuille": choix = 1;break;
                case "pfc:ciseaux": choix = 2;break;
            }
            await c.message.edit({
                content: `Quel est votre choix ? \`${listChoix[choix].toUpperCase()}\``,
                components: []
            }).catch(()=>{});
            if (choix<0)return;
            if (res==choix) {
                m.channel.send(`
                Je prends \`${listChoix[res]?.toUpperCase()}\` ! Égalité!
                `);
            } else if ((res>choix && choix+1==res) || (res<choix && res+choix==2)) {
                m.channel.send(`
                Je prends \`${listChoix[res]?.toUpperCase()}\` ! J'ai gagné!
            `);
            } else {
                m.channel.send(`
                Je prends \`${listChoix[res]?.toUpperCase()}\` ! J'ai perdu!
            `);
            }
        })
    });
}
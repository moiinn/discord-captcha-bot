const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Support extends Command {
    constructor(client) {
        super({
            name: 'support',
            aliases: ['server', 'info', 'information']
        });

        this.client = client;
    }

    exec(message) {

        const embed = new MessageEmbed()
            .setColor(0xa8ffbf)
            .setTitle('<a:Checkmark:565334716090155027> Click Here to Join The Support Server!')
            .setURL("https://discord.gg/yBCdc6y")

        return message.channel.send(embed);

    }

}

module.exports = Support;
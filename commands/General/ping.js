const Command = require('../../structures/Command');
const {
    pingIcon,
    pingIconColor
} = require('../../res/icons.json');
const {
    MessageEmbed
} = require('discord.js');

class Ping extends Command {
    constructor(client) {
        super({
            name: 'ping',
            description: 'Returns Pong!'
        });

        this.client = client;
    }

    exec(message) {

        const embed = new MessageEmbed()
            .setColor(0xffffff)
            .setFooter(`🏓 Pong! I'm currently running: ${Math.floor(this.client.ws.ping)}ms`);

        return message.channel.send(embed);

    }

}

module.exports = Ping;
const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Commands extends Command {
    constructor(client) {
        super({
            name: 'commands',
        });

        this.client = client;

    }

    exec(message) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle('Kensho Commands | What can you run?')
            .setDescription([`➜ **\`!config\`** ~ Displays all the settings you can edit/change!`,
            `➜ **\`!checklist\`** ~ Displays list of what still needs to be setup!`,
            `➜ **\`!newCaptcha\`** ~ Sends a new captcha to a user who is stuck!`,
            `➜ **\`!verify\`** ~ Verifies a user who you trust/is having trouble!`, 
            `➜ **\`!support\`** ~ The Kensho support server, having trouble?`,
            `➜ **\`!help\`** ~ Displays an in-depth guide on using Kensho!`,
            `➜ **\`!stats\`** ~ Displays Kensho's (general & hardware) stats!`,
            `➜ **\`!ping\`** ~ Displays the bot latency/ping!` ].join('\n'))

        message.channel.send(embed)

    }

}

module.exports = Commands;
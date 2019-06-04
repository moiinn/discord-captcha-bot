const Command = require('../../structures/Command');
const {
    pingIcon,
    pingIconColor
} = require('../../res/icons.json');
const {
    MessageEmbed
} = require('discord.js');

class Checklist extends Command {
    constructor(client) {
        super({
            name: 'checklist',
            description: 'Displays a checklist for the Captcha feature.'
        });

        this.client = client;

    }

    exec(message) {

        // Validate Config
        let isConfigValid = message.guild.validateConfig(message.channel);
        if (!isConfigValid) return;

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle(`${message.guild.botName} Captcha Checklist`)

        //if (!this.client.customBranding) embed.setDescription('Did you know you can get custom branding on this bot? Check out my [Patreon](https://www.patreon.com/TrueXPixels)!')
        message.channel.send(embed.setFooter(`System running, system complete!`))

    }

}

module.exports = Checklist;
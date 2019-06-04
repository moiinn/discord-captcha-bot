const Command = require('../../structures/Command');
const {
    pingIcon,
    pingIconColor
} = require('../../res/icons.json');
const {
    MessageEmbed
} = require('discord.js');

class Verify extends Command {
    constructor(client) {
        super({
            name: 'verify',
            description: 'Allows user to verify themselves within a server.'
        });

        this.client = client;

    }

    exec(message) {

        // Validate Config
        let isConfigValid = message.guild.validateConfig(message.channel);
        if (!isConfigValid) return;

        // Fetch Config
        let config = message.guild.config;

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle('Highbrand Verification System')

        // Check Pending Captcha
        if ((this.client.db.get(`captchaServers_${message.author.id}`) || []).includes(message.guild.id)) return message.channel.send(embed.setFooter('Sorry, you already have a pending Captcha.'));

        // Check Existing Member
        if (message.member.roles.find(r => r.name === config.userRoleName.value)) return message.channel.send(embed.setFooter('Sorry, it looks like you\'re already a member.'));

        // Send Confirmation
        message.channel.send(embed.setFooter('Sending Captcha...'));

        // Emit guildMemberAdd Event
        message.client.emit('guildMemberAdd', message.member);

    }

}

module.exports = Verify;
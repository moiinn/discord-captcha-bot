const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class NewCaptcha extends Command {
    constructor(client) {
        super({
            name: 'newcaptcha',
            description: 'Forces a new Captcha on a user.'
        });

        this.client = client;

    }

    exec(message, args) {

        // Validate Config
        let isConfigValid = message.guild.validateConfig(message.channel);
        if (!isConfigValid) return;

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle(`${message.guild.name} Verification System`)

        // Check Permissions
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(embed.setFooter('Sorry, you don\'t have the proper permissions to run this command.'));

        // Check Pinged
        let pinged = message.mentions.members.first() || message.guild.members.get(args.join(' '));
        if (!pinged) return message.channel.send(embed.setFooter('Please mention a user or provide their ID.'));

        message.channel.send(embed.setFooter(`Successfully sent a new Captcha to ${pinged.user.username}'s DMs`));

        // Emit guildMemberAdd Event
        message.client.emit('guildMemberAdd', pinged);

    }

}

module.exports = NewCaptcha;
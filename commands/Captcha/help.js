const Command = require('../../structures/Command');
const {
    pingIcon,
    pingIconColor
} = require('../../res/icons.json');
const {
    MessageEmbed
} = require('discord.js');

class Help extends Command {
    constructor(client) {
        super({
            name: 'help',
            description: 'Displays an in-depth help menu for the Captcha bot.'
        });

        this.client = client;

    }

    exec(message) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle('Verification System | Setup Information')
            .setDescription('\n\nThis is a simple program that requires user to fill in a Captcha before automatically getting a pre-set role.')
            .addField('➜ Getting Started', 'Run **`!checklist`** to view the remaining actions needed to setup the bot.\nYou can also use **`!config`** to view and update the current configuration.')
            .addField('➜ Why is this useful?', 'This helps to protect your server against malicious atacks using\nautomated bots, while not requiring users to go to a separate website and log in.')
            .addField('➜ What if a user is already in the server?', 'Users can run the command **`!verify`** to get a Captcha sent to them,\nit will also add the pre-set role when they complete it.')
            .addField('➜ A user is stuck, what should I do?', 'You can run the command **`!newCaptcha @user`** to give the user a new Captcha.')

        message.channel.send(embed)

    }

}

module.exports = Help;
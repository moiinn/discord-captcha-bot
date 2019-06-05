const Command = require('../../structures/Command');
const count = require('count-array-values')
const { MessageEmbed } = require('discord.js');

class Config extends Command {
    constructor(client) {
        super({
            name: 'config',
            description: 'Displays the configuration for the Captcha feature.'
        });

        this.client = client;
    }

    exec(message, args) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(0x7289DA)

        // Check for administrator perms
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            embed.setTitle('Invalid Permissions')
            embed.setFooter('Sorry, this requires the administrator permission.').setColor(icons.invalidPermissionsColor).setTitle('Configuration');
            return message.channel.send(embed);
        }

        // Fetch Config
        let config = message.guild.config;

        // Check for arguments - Display current values
        if (!args[1]) {
            let output = '_ _\n';

            for (var i in config) {
                if (config[i].type !== 'Captcha') continue;
                output += `__**${config[i].name}**__\n**\`${this.client.prefix}config ${i} ${config[i].args}\`**\n ➜ **Current:** ${config[i].value}\n\n`
            }
            embed.setDescription(output).setTitle(`Current Config - ${message.guild.name}`);
            return message.channel.send(embed)
        }

        let rolePerms;

        // Updating Values
        switch (args[0].toLowerCase()) {
            case 'verificationchannel':

                if (args[1].toLowerCase() === 'none') {
                    this.client.db.delete(`config_${message.guild.id}.verificationChannel`);
                    return message.channel.send(embed.setFooter('Successfully set the verification channel (waiting room) to none.'));
                }

                var channel = message.mentions.channels.first();
                if (!channel) return message.channel.send(embed.setFooter('Please mention a channel or type none.'))

                this.client.db.set(`config_${message.guild.id}.verificationChannel`, channel.id);
                message.channel.send(embed.setFooter(`Successfully set the verification channel (waiting room) to #${channel.name}`));

                var guildList = this.client.db.get(`validConfigs_${this.client.user.id}`) || [];
                var guildIndex = guildList.indexOf(message.guild.id);
                if (guildIndex !== -1) {
                    guildList.splice(guildIndex, 1);
                    this.client.db.set(`validConfigs_${this.client.user.id}`, guildList);
                }

                break;
            case 'userrolename':

                args.shift()

                if (args.join(' ').trim().toLowerCase() === 'none') {
                    this.client.db.delete(`config_${message.guild.id}.userRoleName`);
                    return message.channel.send(embed.setFooter(`Successfully set the user role to none.`));
                }

                var role = message.guild.roles.find(r => r.name.trim() === args.join(' ').trim());

                if (!role) return message.channel.send(embed.setFooter(`Sorry, a role with the name ${args.join(' ').trim()} could not be found.`));

                this.client.db.set(`config_${message.guild.id}.userRoleName`, role.id);

                message.channel.send(embed.setFooter(`Successfully set the user role to @${role.name}.`));

                var guildList = this.client.db.get(`validConfigs_${this.client.user.id}`) || [];
                var guildIndex = guildList.indexOf(message.guild.id);
                if (guildIndex !== -1) {
                    guildList.splice(guildIndex, 1);
                    this.client.db.set(`validConfigs_${this.client.user.id}`, guildList);
                }

                break;
            case 'captchalogschannel':

                if (args[1].toLowerCase() === 'none') {
                    this.client.db.delete(`config_${message.guild.id}.captchaLogsChannel`);
                    return message.channel.send(embed.setFooter('Successfully set the Captcha logs channel to none.'));
                }

                var channel = message.mentions.channels.first();
                if (!channel) return message.channel.send(embed.setFooter('Please mention a channel or type none.'))

                this.client.db.set(`config_${message.guild.id}.captchaLogsChannel`, channel.id);
                message.channel.send(embed.setFooter(`Successfully set the Captcha logs channel to #${channel.name}`));

                var guildList = this.client.db.get(`validConfigs_${this.client.user.id}`) || [];
                var guildIndex = guildList.indexOf(message.guild.id);
                if (guildIndex !== -1) {
                    guildList.splice(guildIndex, 1);
                    this.client.db.set(`validConfigs_${this.client.user.id}`, guildList);
                }

                break;
            case 'additionalroles':

                args.shift()

                if (args.join(' ').trim().toLowerCase() === 'none') {
                    this.client.db.delete(`config_${message.guild.id}.additionalRoles`);
                    return message.channel.send(embed.setFooter(`Successfully removed the additional roles.`));
                }

                var role = message.guild.roles.find(r => r.name.trim() === args.join(' ').trim());

                if (!role) return message.channel.send(embed.setFooter(`Sorry, a role with the name ${args.join(' ').trim()} could not be found.`));

                this.client.db.push(`config_${message.guild.id}.additionalRoles`, role.id);

                message.channel.send(embed.setFooter(`Successfully added the role @${role.name} to additional roles.`));

                var guildList = this.client.db.get(`validConfigs_${this.client.user.id}`) || [];
                var guildIndex = guildList.indexOf(message.guild.id);
                if (guildIndex !== -1) {
                    guildList.splice(guildIndex, 1);
                    this.client.db.set(`validConfigs_${this.client.user.id}`, guildList);
                }


                break;
            case 'bypasscaptcha':

                args.shift()

                if (args.join(' ').trim().toLowerCase() === 'true') {
                    this.client.db.set(`config_${message.guild.id}.bypassCaptcha`, true);
                    return message.channel.send(embed.setFooter(`Successfully enabled Captcha bypassing.`));
                } else if (args.join(' ').trim().toLowerCase() === 'false') {
                    this.client.db.set(`config_${message.guild.id}.bypassCaptcha`, false);
                    return message.channel.send(embed.setFooter(`Successfully disabled Captcha bypassing.`));
                } else return message.channel.send(embed.setFooter(`Sorry, please select true or false.`));

                var guildList = this.client.db.get(`validConfigs_${this.client.user.id}`) || [];
                var guildIndex = guildList.indexOf(message.guild.id);
                if (guildIndex !== -1) {
                    guildList.splice(guildIndex, 1);
                    this.client.db.set(`validConfigs_${this.client.user.id}`, guildList);
                }

                break;
            default:

                return message.channel.hook(embed.setFooter('Sorry, I couldn\'t find that configuration.'), {
                    name: 'Unknown Configuration',
                    icon: icons.roleIcon
                });

        }

    }

}

module.exports = Config;
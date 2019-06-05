const Command = require('../../structures/Command');
const hastebin = require('hastebin-gen');
const Discord = require('discord.js');
const captcha = require('svg-captcha');
const { MessageEmbed } = require('discord.js');

class Exec extends Command {
    constructor(client) {
        super({
            name: 'exec',
            description: 'Developer // Execute code'
        });

        this.client = client;
    }

    async exec(message, args) {

        if (message.author.id !== '466278478011170826') {

            const embed = new Discord.MessageEmbed()
                .setFooter('Sorry, you don\'t have access to this command.')
                .setColor(0xffffff)

            return send(embed)

        }

        if (!args) return message.channel.send(new MessageEmbed()
        .setTitle(`I was not given anything to execute!`)
        .setColor(0xff8282));

      try {
        const { stdout, stderr } = await (require('util')).promisify(require('child_process').exec)(args.join(" "));
        if (stderr) return new Error(stderr);
        await message.channel.send(new MessageEmbed()
          .setTitle(`Execution Complete`)
          .setColor(0xa8ffbf));

        await message.send(`\`\`\`fix\n${stdout}\n\`\`\``);
      } catch (err) {
        await message.channel.send(new MessageEmbed()
          .setTitle(`Execution Failed`)
          .setColor(0xff8282));
        await message.channel.send(`\`\`\`js\n${(require('util').inspect(err, {depth: 0}))}\n\`\`\``);
      }
    }
}

module.exports = Exec;
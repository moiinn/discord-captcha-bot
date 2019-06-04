const Command = require('../../structures/Command');
const {
    pingIcon,
    pingIconColor
} = require('../../res/icons.json');
const {
    MessageEmbed
} = require('discord.js');
const os = require('os');
const hb = require('hastebin-gen');
const {
    table
} = require('table');

class Stats extends Command {
    constructor(client) {
        super({
            name: 'stats',
            description: 'Displays general statistics.'
        });

        this.client = client;
        // console.log('hello from ping')
    }

    parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0] - 1, mdy[1]);
    }

    datediff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    byteToMB(bytes) {
        return bytes / 1024 / 1024;
    }

    async exec(message) {

        // Data
        var bul, date, guilds, users, memory, totalMem, captchasSent, captchasBypassed, hbText, hastebin, guildsTable;

        // Fields
        var general, server, extra;

        // Generate Data
        bul = '**•** ';
        date = new Date();
        guilds = this.client.guilds;
        users = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
        memory = `${Math.round(this.byteToMB(process.memoryUsage().heapUsed))} MB / ${Math.round(this.byteToMB(os.totalmem()))} MB (${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)}%)`
        hbText = `Verification System by Highbrand\n\nRun "!stats" for more information\n\n`;

        // Generate Guilds Table
        guildsTable = this.client.guilds.sort((g1, g2) => g2.memberCount - g1.memberCount).map(g => {
            var resp = [];
            resp.push(g.name.match(/[a-zA-Z!?\.\|\'\-\\\@\#\%\^\&\*\(\)\_\+\<\>\,\/\?\"\'\:\;\}\]\[\{\=\~\`\ ]+/));
            resp.push(g.memberCount);
            if (g.features.length == 0) resp.push('False');
            else resp.push('True');
            return resp;
        })
        guildsTable.unshift(['Name', 'Members', 'Partnered']);
        hbText += table(guildsTable, {
            columns: {
                0: {
                    width: 25
                }
            }
        });

        hastebin = await hb(hbText.replace(/\�/g, ''), 'txt');

        // Generate Fields
        general = `${bul}Servers: [**\`${guilds.size}\`**](${hastebin})\n`;
        general += `${bul}Users: **\`${users}\`**`;

        server = `${bul}OS: **\`${this.client.capitalizeFirstLetter(process.platform)} ${process.arch}\`**\n`
        server += `${bul}CPU: **\`${os.cpus().length} Cores / ${os.cpus()[0].model}\`**\n`;
        server += `${bul}Memory: **\`${memory}\`**`

        const embed = new MessageEmbed()
            .setColor(0x7289DA)
            .setTitle(message.guild.me.nickname || this.client.user.username)
            .addField('General Information', general)
            .addField('Server Information', server)

        message.channel.send(embed);

    }

}

module.exports = Stats;
const Discord = require('discord.js');
const Hook = require('quick.hook');
const db = require('quick.db');
const ms = require('parse-ms');
new (require('./Logger'))({ appname: 'Kensho' });

require('./Guild');
require('./GuildChannel');
require('./GuildMember');
require('./Message');
require('./Role');
require('./User');
require('./TextChannel');

class Base extends Discord.Client {
    constructor(settings, ...args) {
        super(...args);
        
        // Setup
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.CommandHandler = new (require('./CommandHandler'))(this);
        this.EventHandler = new (require('./EventHandler'))(this);
        this.hook = Hook;
        this.db = db;
        this.help = {};
        
        // Branding
        this.prefix = settings.prefix || '>';
        this.playing = settings.playing;
        
    }
  
    removeDuplicates(arr){
        let unique_array = []
        for(let i = 0;i < arr.length; i++){
            if(unique_array.indexOf(arr[i]) == -1){
                unique_array.push(arr[i])
            }
        }
        return unique_array
    }
    
    run() {
        this.CommandHandler.load();
        this.EventHandler.load();
    }
  
    parseTime(milliseconds, from, seconds) {
        var string = '', obj;
        if (!from) obj = ms(Date.now() - milliseconds);
        else obj = ms(milliseconds)
        if (obj.days === 1) string += ` ${obj.days} day `
        else if (obj.days > 1) string += ` ${obj.days} days `
        if (obj.hours === 1) string += `${obj.hours} hour `
        else if (obj.hours > 1) string += `${obj.hours} hours `
        if (obj.minutes === 1) string += `${obj.minutes} minute `
        else if (obj.minutes > 1) string += `${obj.minutes} minutes `
        if (seconds && obj.seconds === 1) string += `${obj.seconds} second `
        else if (seconds && obj.seconds > 1) string += `${obj.seconds} seconds `
        if (string === '') string = 'Just now'
        else string += 'ago'
        return string;
      }
    
    get dateToHour() {
        let d = new Date();
        return new Date().toJSON().substring(0, 13);
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    randomInt(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
  
    sendStatement(stmt) {
      console.log(stmt);
      this.guilds.get(this.guildID).channels.get(this.captchaLogsChannelID).send(stmt, { disableEveryone: true });
    }
  
    getMultipleConfigs(guildIDArray) {
      let array = [];
      for (var i = 0; i < guildIDArray.length; i++) {
        let guild = this.guilds.get(guildIDArray[i]);
        array.push({
            verificationChannel: {
                name: 'Verification Channel',
                args: '[ #channel | none ]',
                value: guild.parseID(this.db.get(`config_${guild.id}.verificationChannel`)).data || 'none'
            },
            userRoleName: {
                name: 'User Role Name',
                args: '[ roleName | none ]',
                value: guild.parseID(this.db.get(`config_${guild.id}.userRoleName`)).data || 'none'
            },
            captchaLogsChannel: {
                name: 'Captcha Logs Channel',
                args: '[ #channel | none ]',
                value: this.db.get(`config_${guild.id}.captchaLogsChannel`) || 'none'
            }
          })
      }
    }
    
}

module.exports = Base;
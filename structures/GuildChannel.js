const { Structures, MessageEmbed } = require('discord.js');

Structures.extend('TextChannel', GuildChannel => {
   class GuildChannelExt extends GuildChannel {
       constructor(...args) {
        super(...args);    
       }
     
       get me() {
         return this.members.get(this.client.user.id);
       }
        
   }
   return GuildChannelExt;
});
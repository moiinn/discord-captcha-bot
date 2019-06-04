const {
    Structures
} = require('discord.js');

Structures.extend('User', User => {
    class UserExt extends User {
        constructor(...args) {
            super(...args);
        }

        get validServers() {
 
            let servers = this.client.db.get(`captchaServers_${this.id}`);
            if (!servers) return;
            
            servers = this.client.removeDuplicates(servers);
          
            let validServers = [];
            for (var i in servers) {
                var guild = this.client.guilds.get(servers[i]);
                if (!guild) continue;
                else if (!guild.validateConfig()) continue;
                else validServers.push(guild);
            }
            if (!validServers) return false;
            else return validServers;

        }

    }

    return UserExt;
});
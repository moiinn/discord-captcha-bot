const {
    Structures,
    MessageEmbed
} = require('discord.js');
const icons = require('../res/icons.json');

Structures.extend('Guild', Guild => {
    class GuildExt extends Guild {
        constructor(...args) {
            super(...args);
        }

        get memberSize() {
            return this.memberCount.toLocaleString();
        }

        get botName() {
            return this.me.nickname || this.client.user.username;
        }

        /* Parses a given ID */
        parseID(ID) {
            if (!ID) return { type: 'none', data: null };
            else if (this.channels.has(ID)) return { type: 'channel', data: this.channels.get(ID) };
            else if (this.members.has(ID)) return { type: 'member', data: this.members.get(ID) };
            else if (this.roles.has(ID)) return { type: 'role', data: this.roles.get(ID) };
            else return { type: 'none', data: null };
        }
        
        get prefix() {
            return this.client.db.get(`config_${this.id}.prefix`) || '!';   
        }
      
        get config() {
        
          var additionalRoles = this.client.db.get(`config_${this.id}.additionalRoles`);
        
          return {
            verificationChannel: {
                type: 'Captcha',
                name: 'Verification Channel',
                args: '[ #channel | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.verificationChannel`)).data || 'none'
            },
            userRoleName: {
                type: 'Captcha',
                name: 'User Role Name',
                args: '[ roleName | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.userRoleName`)).data || 'none'
            },
            captchaLogsChannel: {
                type: 'Captcha',
                name: 'Captcha Logs Channel [**__ Should only be viewable by Staff __**]',
                args: '[ #channel | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.captchaLogsChannel`)).data || 'none'
            },
            additionalRoles: {
                type: 'Captcha',
                name: 'Additional Roles [**__ Adds the role to a list of roles to add. Set `none` to clear __**]',
                args: '[ roleName | none ]',
                value: ( additionalRoles ? additionalRoles.map(e => this.parseID(e).data) : 'none')
            },
            bypassCaptcha: {
                type: 'Captcha',
                name: 'Bypass Captcha [**__ Only if they\'ve completed a Captcha in another server __**]',
                args: '[ true | false ]',
                value: (this.client.db.get(`config_${this.id}.bypassCaptcha`) ? true : false)
            },
            guildMemberLog: {
                type: 'General',
                name: 'Guild Member Log',
                args: '[ #channel | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.guildMemberLog`)).data || 'none'
            },
            autoRole: {
                type: 'General',
                name: 'Auto Role',
                args: '[ roleName | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.autoRole`)).data || 'none'
            },
            persistentRoles: {
                type: 'General',
                name: 'Persistent Roles',
                args: '[ true | false ]',
                value: (this.client.db.get(`config_${this.id}.persistentRoles`) ? true : false)
            },
            messageLog: {
                type: 'General',
                name: 'Message Log',
                args: '[ #channel | none ]',
                value: this.parseID(this.client.db.get(`config_${this.id}.messageLog`)).data || 'none'
            },
            antiInvite: {
                type: 'Moderation',
                name: 'Anti Invite',
                args: '[ true | false ]',
                value: (this.client.db.get(`config_${this.id}.antiInvite`) ? true : false)
            },
            moderationLog: {
                type: 'Moderation',
                name: 'Moderation Log',
                args: "[ #channel | none ]",
                value: this.parseID(this.client.db.get(`config_${this.id}.moderationLog`)).data || 'none'
            }
          }
        }
      
        /* Validates the server's config */
        validateConfig(sendToChannel) {
          
          // Cached Success
          if ((typeof this.client.db.get(`validConfigs_${this.client.user.id}`) instanceof Array ? this.client.db.get(`validConfigs_${this.client.user.id}`) : []).includes(this.id)) return true;
            
          // Fetch Config
          let config = this.config;
          
          const embed = new MessageEmbed()
            .setTitle('Improper Server Configuration')
            .setColor(0x7289DA)

          let invalidItems = '';
          if ((config.verificationChannel.value == 'none' || !config.verificationChannel)) invalidItems += '- Set the verification channel (Waiting Room) [Use: !config]\n';
          if ((config.verificationChannel.value != 'none' && config.verificationChannel.value) && config.verificationChannel.value.me && !config.verificationChannel.value.me.hasPermission('SEND_MESSAGES')) invalidItems += '- Give the Captcha bot proper permissions in the verification channel\n';
          if ((config.userRoleName.value == 'none' || !config.userRoleName.value)) invalidItems += '- Set the user role name for the server (Given when they complete the Captcha) [Use: !config]\n';
          if ((config.userRoleName.value && config.userRoleName.value != 'none') && !config.userRoleName.value.editable) invalidItems += '- Place the bot\'s role above the user role\n';
          if ((config.userRoleName.value && config.userRoleName.value != 'none') && !this.roles.find(r => r.name)) invalidItems += '- Set a valid user role name for the server (Given when they complete the Captcha)\n';
          if (!this.me.hasPermission('MANAGE_ROLES')) invalidItems += '- Give the `Manage Roles` permission to the Captcha bot\n';
          
          let desc;
          if (invalidItems) desc = 'Sorry, this server has not been fully setup by an administrator.\n\nPlease **complete the following:**\n' + invalidItems;
          if (desc && sendToChannel) {
            sendToChannel.send(embed.setDescription(desc)).catch(err => console.trace('Cannot Send Message'));
            return false;
          } else if (desc && !sendToChannel) return false;
          else {
              if (!this.client.db.get(`validConfigs_${this.client.user.id}`)) this.client.db.set(`validConfigs_${this.client.user.id}`, [this.id]);
              else this.client.db.push(`validConfigs_${this.client.user.id}`, this.id);
              return true;
          }
          
        }

    }
    return GuildExt;
});

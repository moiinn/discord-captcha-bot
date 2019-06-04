const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {

    if (message.channel.type === 'dm') {
      
      // Fetch Captcha Text
      let captchaText = client.db.get(`captcha_${message.author.id}`);
      if (!captchaText) return;
      
      // Fetch Servers
      let validServers = message.author.validServers;
      if (!validServers) return;

      // Create Embed
      const embed = new MessageEmbed()
        .setColor(0x7289DA);
      
      // Compare
      captchaText.answer = captchaText.answer.replace(/\s/g, '');
      if (message.content === captchaText.answer) {
        
        // Create Correct Embed
        embed.setTitle(`Thank you!`);

        // Set Footer
        if (validServers.length === 1) embed.setDescription(`You have been given access to ${validServers[0].name}!`);
        else if (validServers.length === 2) embed.setDescription(`You have been given access to ${validServers[0].name} & ${validServers[1].name}!`);
        else embed.setDescription(`You have been given access to: ${validServers.map(s => s.name).join(', ')}!`);
        
        if (!client.customBranding || client.customBranding === 'Highbrand Development')''
        
        // Send
        await message.author.send(embed).catch(err => console.trace('Cannot Send Message'));
        
        // Delete from captcha database
        client.db.delete(`captcha_${message.author.id}`);
        client.db.delete(`captchaServers_${message.author.id}`);
        
        // Add Roles
        for (var i in validServers) {
          var member = validServers[i].members.get(message.author.id);
          var config = validServers[i].config;
          var additionalRoles = config.additionalRoles.value || [];
          if (typeof additionalRoles == 'object' && additionalRoles.length > 0) {
              additionalRoles.push(config.userRoleName.value);
              additionalRoles = additionalRoles.filter(i => i); 
              await member.roles.add(additionalRoles).catch(e => console.trace(e, 'Invalid Permissions: ADDING ROLES')); 
          } else await member.roles.add(config.userRoleName.value).catch(err => console.trace('Cannot Send Message'));
          
        }
  
        console.log(`${message.author.username} has completed the Captcha [ Looking for: ${captchaText.answer} | Given: ${message.content} ]`);
        
        embed.setTitle('Captcha Completed')
             .setFooter('')
             .setDescription('')
             .addField('User', message.author.tag, true)
             .addField('Looking For', captchaText.answer, true)
             .addField('Given', message.content, true);
        
        // Send Logs
        for (var i in validServers) {
          var config = validServers[i].config;
          if (config.captchaLogsChannel.value !== 'none') await config.captchaLogsChannel.value.send(embed).catch(err => console.trace('Cannot Send Message'));
        }
          
        // Update Persistent Database
        if (!client.db.get('verifiedUsers')) client.db.set('verifiedUsers', [message.author.id]);
        else client.db.push('verifiedUsers', message.author.id);
        
      } else {
        
        // Fetch Remaining Attempts
        let remaining = (client.db.get(`captcha_${message.author.id}`).attemptsRemaining || 3) - 1;
        if (remaining < 0) return; // Return if out of attempts
        
        let failAction = `type **\`!verify\`** in ${validServers[validServers.length-1].config.verificationChannel.value}`;
        
        // Display Incorrect
        let incorrect = [];
        if (captchaText.answer[0] !== message.content[0]) incorrect.push('**1st**');
        if (captchaText.answer[1] !== message.content[1]) incorrect.push('**2nd**');
        if (captchaText.answer[2] !== message.content[2]) incorrect.push('**3rd**');
        if (captchaText.answer[3] !== message.content[3]) incorrect.push('**4th**');
        if (captchaText.answer[4] !== message.content[4]) incorrect.push('**5th**');
        let incorrectChars = '';
        
        if (incorrect.length === 1) incorrectChars = `Sorry, you got the ${incorrect[0]} character incorrect.`;
        else if (incorrect.length === 2) incorrectChars = `Sorry, you got the ${incorrect[0]} & ${incorrect[1]} characters incorrect.`;
        else {
            let lastChar = incorrect.pop();
            incorrectChars = `Sorry, you got the ${incorrect.join(', ')} & ${lastChar} characters incorrect.`;
        }
          
        // Create Incorrect Embed
        embed.setTitle('Invalid Response')
             .setDescription(`${incorrectChars}\n\nYou have ${remaining != 0 ? (remaining == 1 ? `**${remaining}** attempt remaining.` : `**${remaining}** attempts remaining.`) : `**0** attempts remaining.\nThe code was **\`${captchaText.answer}\`**.\nPlease ${failAction} to obtain a new Captcha.`}`)
        
        // Send Embed
        await message.author.send(embed).catch(err => console.trace('Cannot Send Message'));
        
        // Update Database Accordingly
        if (remaining === 0) client.db.delete(`captcha_${message.author.id}`);
        else client.db.subtract(`captcha_${message.author.id}.attemptsRemaining`, 1);
        
        console.log(`${message.author.username} has failed the Captcha [ Looking for: ${captchaText.answer} | Given: ${message.content} ]`);
      
        embed.setTitle('Captcha Failed')
             .setFooter('')
             .setDescription('')
             .addField('User', message.author.tag, true)
             .addField('Looking For', captchaText.answer, true)
             .addField('Given', message.content, true);
        
        // Send Logs
        for (var i in validServers) {
          var config = validServers[i].config;
          if (config.captchaLogsChannel.value !== 'none') await config.captchaLogsChannel.value.send(embed).catch(err => console.trace('Cannot Send Message'));
        }
        
      }
      
    }

    // Anti invite
      const inviteMatch = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+\w/gi; //oof nice yes indeed

      const data = message.content.split(' ');
      let [ wl, inv ] = [0, 0]; // wl is whitelisted, inv is other invites

      for (var i of data) {
        if (inviteMatch.test(i)) { // Check if the content has an invite in it.
          inv++;

          const guildInvites = await message.guild.fetchInvites();
          if (guildInvites.find(invite => invite.url === i)) { // Check if the invite is one from the current guild
            wl++;
            continue;
          }
        } else continue;
      }

      if (wl !== inv) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) return;
        message.delete();

        const embed = new MessageEmbed()
          .setColor(0xff4444)
          .setFooter(message.author.tag + ', please refrain from posting invites.')
        message.channel.send(embed);
        }
    

    // Check for prefix
    if (message.content.startsWith(client.user.toString())) message.content = message.content.replace(client.user.toString(), client.prefix)
    if (!message.content.startsWith(client.prefix)) return;
    
    // Declare & Initialize Variables
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    // Return Statements
    if (message.author.bot || !message.channel.guild || !message.guild || message.channel.type !== 'text') return;
    if (!client.commands.has(cmd)) return;
    
    // Run Command
    const command = client.commands.get(cmd);
    command.exec(message, args);
    
}
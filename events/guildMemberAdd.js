const captcha = require('svg-captcha');
const svg2png = require('svg2png');
const { MessageEmbed, Attachment } = require('discord.js');

exports.run = async (client, member) => {
  
  // Fetch Config
  let config = member.guild.config; 

  // Validate Config
  let isConfigValid = member.guild.validateConfig(false);
  if (!isConfigValid) return;
  
  // isBot?
  if (member.user.bot) return;
    
  // Captcha Bypass
  if (config.bypassCaptcha.value && (client.db.get('verifiedUsers') || []).includes(member.id)) {
      
      // Add Roles
      var additionalRoles = config.additionalRoles.value || [];
      if (typeof additionalRoles == 'object' && additionalRoles.length > 0) {
          additionalRoles.push(config.userRoleName.value);
          additionalRoles = additionalRoles.filter(i => i);
          await member.roles.add(additionalRoles).catch(e => console.trace(e, 'Invalid Permissions: ADDING ROLES')); 
      } else await member.roles.add(config.userRoleName.value).catch(err => console.trace('Cannot Add Role'));

      // Create Embed
      const captchaLog = new MessageEmbed()
        .setTitle('Captcha Bypassed')
        .setDescription('This user has already completed a Captcha in another server.')
        .addField('Member', member.user.tag, true)
        .setColor(0x7289DA);
      
      // Log
      if (config.captchaLogsChannel.value !== 'none') config.captchaLogsChannel.value.send(captchaLog).catch(err => console.trace('Cannot send message to logs channel.'));
      
      // Update Database & Return
      console.log(`[Captcha Bypass] ${member.user.tag}`);
      return client.db.add(`stats.captchasBypassed`, 1);
      
  }

  // Generate SVG
  let svg = captcha.create({ noise: 2, size: 5, background: '#7289DA', ignoreChars: 'f0o1il' }); // -> { data: <svg>, text: <string> }

  // Convert SVG to PNG
  let pngBuffer = await svg2png(svg.data);

  // Create DM Embed
  const dmEmbed = new MessageEmbed()
    .setColor(0x7289DA)
    .setTitle(`Welcome To ${member.guild.name}!`)
    .addField('Captcha', 'Please complete the captcha below to gain access to the server.\n**NOTE:** This is **Case Sensitive**.\n\n**Why?**\nThis is to protect the server against\nmalicious raids using automated bots.\n_ _\n_ _')
    .addField('Your Captcha:', '_ _')
    .attachFiles([{ attachment: pngBuffer, name: 'captcha.png' }])
    .setImage('attachment://captcha.png')
  
  // Send DM Embed (Captcha)
  let sent = true;
  await member.send(dmEmbed).catch(e => sent = false);
    
  // ? Create Error Embed
  let failedEmbed;
  if (!sent) {
    failedEmbed = new MessageEmbed()
      .setColor(0x7289DA)
      .setTitle(`${member.guild.name} Verification`)
      .setDescription('I wasn\'t able to send you a message! Please ensure you have DMs turned on, then run **`!verify`** in this channel. You can turn your DMs back off once you complete the captcha.')
      .setImage('https://i.imgur.com/Xa5XoEK.png')
      .setFooter('Need Help? Feel free to ping a staff member.');
  }
  
  // Store valid answer in database & await response (continue in message.js)
  if (sent) {
    
    client.db.set(`captcha_${member.id}`, { answer: svg.text, attemptsRemaining: 3 });
    
    // Create Embed
      const captchaLog = new MessageEmbed()
        .setTitle('Captcha Updated')
        .setDescription('This user joined another server using the Captcha bot, therefore their Captcha code was updated.')
        .addField('Sent To', member.user.tag, true)
        .addField('Looking For', svg.text, true)
        .attachFiles([{ attachment: pngBuffer, name: 'captcha.png' }])
        .setImage('attachment://captcha.png')
        .setColor(0x7289DA);
    
    // Fetch Previous Captchas
    let previousCaptchas = client.db.get(`captchaServers_${member.id}`, member.guild.id) || [];
    let validServers = member.user.validServers;
    if (validServers) {
      
      // Filter
      validServers.filter(s => previousCaptchas.includes(validServers));

      // Send Message
      await validServers.map(g => {
        if (g.config.captchaLogsChannel.value !== 'none' && g.id !== member.guild.id) g.config.captchaLogsChannel.value.send(captchaLog).catch(err => console.trace('Cannot send message to logs channel (notifying Captcha change)'))}
      );
      
    }
    
    // Update
    console.log(`${member.user.username} was sent a Captcha [ Looking for: ${svg.text} ]`);
    previousCaptchas.push(member.guild.id);
    client.db.set(`captchaServers_${member.user.id}`, previousCaptchas);
    client.db.add(`stats.captchasSent`, 1);
    
    // Send Captcha Log
    captchaLog.setDescription('').setTitle('Captcha Sent');
    if (config.captchaLogsChannel.value !== 'none') config.captchaLogsChannel.value.send(captchaLog).catch(err => console.trace('Cannot send message to logs channel.'));
    
  } else config.verificationChannel.value.send(member, failedEmbed).catch(err => console.trace('Cannot send message to verification channel.'));
  
}
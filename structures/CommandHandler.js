'use strict';

const { resolve } = require('path');
const walk = require('walk');

class CommandHandler {
  constructor(client) {
    this.client = client;
  }
  async load() {
    const walker = walk.walk('./commands', { followLinks: true });
    walker.on("file", (root, stats, next) => {
      if (!stats.name.endsWith('.js')) return;
      const Command = require(`${resolve(root)}/${stats.name}`);
      const command = new Command(this.client);
      command.aliases.forEach(r => {
        this.client.aliases.set(r, command);
      });
      this.client.commands.set(command.name, command);
      console.log('Loaded Command: ' + command.name);
      if (!this.client.help[resolve(root).split('\\').pop()]) this.client.help[resolve(root).split('\\').pop()] = [`${command.name} - *${command.description}*`];
      else this.client.help[resolve(root).split('\\').pop()].push(`${command.name} - *${command.description}*`);
      next();
    });
  }
}

module.exports = CommandHandler;
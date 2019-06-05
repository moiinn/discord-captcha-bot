const http = require('http');
const express = require('express');
const app = express();

exports.run = (client) => {
  
  console.log(`${client.user.tag} is ready to serve ${client.users.size} users in ${client.guilds.size} guilds.`);
  client.user.setStatus('idle');

  game(client);
  client.setInterval(() => {
    game(client);
  }, 9000);

  function game(client) {
    let games = [
      [ `${client.guilds.size} guilds | Shard 1/2`, "WATCHING" ],
      [ `${client.users.size} users | Shard 1/2`, "WATCHING" ],
      [ "to PotentialRaidsFM", "LISTENING"],
      [ "stuck? Use !help for more information", "PLAYING"],
      [ "Alek Sasuni", "WATCHING" ],
      [ "try me!", "PLAYING"],
      [ "use !support!", "WATCHING" ],
      [ "https://discord.gg/yBCdc6y", "WATCHING" ],
      [ "Not working? Run !checklist", "PLAYING" ],
      [ "Powered by GFuel!", "WATCHING" ],
      [ "What am I suppoused to put here?", "WATCHING" ]
    ];
  
    let array = games[Math.floor(Math.random() * games.length)];
    client.user.setActivity(`${array[0]} | !help`, { type: array[1] }).catch(() => {});
  }
}
const http = require('http');
const express = require('express');
const app = express();

exports.run = (client) => {
  
  console.log(`${client.user.tag} is ready to serve ${client.users.size} users in ${client.guilds.size} guilds.`);

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
      [ "Highbrand Development", "WATCHING" ],
      [ "try me!", "PLAYING"]
    ];
  
    let array = games[Math.floor(Math.random() * games.length)];
    client.user.setActivity(`${array[0]} | !help`, { type: array[1] }).catch(() => {});
  }
}
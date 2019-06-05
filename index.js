const Client = require('./structures/Client');

// Discord Client
const client = new Client({
    disabledEvents: ['TYPING_START'],
    status: 'idle',
    prefix: '!'
});

client.run();
client.login("NTY1MDE5NDE2ODAzMTQ3Nzc2.XPcLIQ.0SAaogK6XHM4QEOv4CcJ4U-sykM");

/*
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
    response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
*/
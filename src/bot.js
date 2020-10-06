
console.log("Turning on Application")
const fs = require("fs");
const { Client } = require('discord.js');
const Indy = require("./indy.js")
const PG = require("./postgres.js")

var _METADATA = null;
try {
    _METADATA = JSON.parse(fs.readFileSync("./config.json"))
    console.log("MetaData", _METADATA)
} catch (e) {
    console.error(e)
}

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const PREFIX = "!";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const [CMD, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
    switch (CMD.toLowerCase()) {
        case "test":
            PG.test(message);
            break;
        case "indy":
            Indy.item_lookup(message, args);
            break;
    }
})

console.log("Logging in")
client.login(_METADATA.token);
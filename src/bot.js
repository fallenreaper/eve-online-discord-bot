
console.log("Turning on Application")
const { Client } = require('discord.js');
const _METADATA = require("./config").get()
const INDY = require("./indy")
const PG = require("./postgres")
const KILLS = require("./kills")

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const PREFIX = "!";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    KILLS.init();
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
            INDY.item_lookup(message, args);
            break;
        case "kills":
            KILLS.getSystemMetadata(message, args[0])
            break;
    }
})

console.log("Logging in")
client.login(_METADATA.token);
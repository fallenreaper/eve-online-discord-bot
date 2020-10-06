
console.log("Turning on Application")
const { Client } = require('discord.js');
const _METADATA = require("./config.js").get()
const Indy = require("./indy.js")
const PG = require("./postgres.js")

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
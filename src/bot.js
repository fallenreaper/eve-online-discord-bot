console.log("Turning on Application");
const { Client } = require("discord.js");
const _METADATA = require("./config").get();
const INDY = require("./indy");
const PG = require("./postgres");
const KILLS = require("./kills");
const ALERTS = require("./alert");

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});

const PREFIX = "!";

const isOfficerOrDirector = (message) => {
  let author = message.author;
  let userData = Array.from(
    message.channel.guild.members.cache.values()
  ).filter((i) => i.user.id === author.id);
  if (userData.length === 0) {
    message.reply("No Authorized.");
    return false;
  }

  let validRoles = new Set(
    Array.from(message.channel.guild.roles.cache.values())
      .filter((i) => {
        return (
          i.name.toLowerCase() === "Officer".toLowerCase() ||
          i.name.toLowerCase() == "Director".toLowerCase()
        );
      })
      .map((r) => r.id)
  );
  let isValidRole =
    userData[0]._roles.filter((roleId) => validRoles.has(roleId)).length > 0;
  if (!isValidRole) {
    message.reply("Not Authorized");
    return false;
  }
  return true;
};

client.on("ready", () => {
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
      KILLS.getSystemMetadata(message, args[0]);
      break;
    case "alert":
      if (!isOfficerOrDirector) {
        break;
      }
      ALERTS.alert(message, args);
      break;
    case "waffle":
      message.reply("Make yourself a waffle.");
      break;
    case "help":
      message.reply(
        "```HELP MENU:\nOfficer or Higher:\n!alert [channel] [date] [evetime] [m] MESSAGE => will post alerts in a given channel at a given time.  [m] is a comma delimited list of references to the end time. Example: 1 will ping 1 minute prior. 1,2 will ping both 1 and 2 minutes prior.  Less than 1, is in seconds.  .5 = 30 seconds, .25 = 15 seconds, etc.\n\nLine Pilot:\n!kills [system] =>  Eve Online System Metrics regarding NPC/Player kills\n!waffle => Beacause.\n\n[Coming Soon]\n!evetime => reports the current eve time.\n!indy => Will do various industrial based computations.```"
      );
  }
});

console.log("Logging in");
client.login(_METADATA.token);

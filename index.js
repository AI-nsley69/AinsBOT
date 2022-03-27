const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");

// Create intents for discord bot so library is satisfied"
const intents = new Intents();
intents.add(
    Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
)
// Create a new client object, load the dotenv config and login as the bot
const client = new Client({ intents: intents });
dotenv.config();
client.login(process.env.token);

const bot = {
    client: client,
    fs: require("fs"),
    utils: require("./modules/utils.js")
}

bot.config = JSON.parse(bot.fs.readFileSync("./config.json"));

// Read the directory containing commands and then add them to a map
bot.commandFiles = bot.fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
bot.commands = new Map();
for (let i = 0; i < bot.commandFiles.length; i++) {
    bot.commands.set(bot.commandFiles[i].replace(".js", ""), require(`./commands/${bot.commandFiles[i]}`));
}
// Repeat for admin commands
bot.adminCommandFiles = bot.fs.readdirSync("./commands/admin/").filter(file => file.endsWith(".js"));
bot.adminCommands = new Map();
for (let i = 0; i < bot.adminCommandFiles.length; i++) {
    bot.adminCommands.set(bot.adminCommandFiles[i].replace(".js", ""), require(`./commands/admin/${bot.adminCommandFiles[i]}`));
}
// Repeat, again, for events
bot.eventFiles = bot.fs.readdirSync("./events/").filter(file => file.endsWith(".js"));
bot.events = new Map();
for (let i = 0; i < bot.eventFiles.length; i++) {
    bot.events.set(bot.eventFiles[i].replace(".js", ""), require(`./events/${bot.eventFiles[i]}`));
}

bot.events.forEach((v, eventName, events) => {
    const event = bot.events.get(eventName);
    bot.client.on(eventName, async (...args) => {
        event.run(bot, ...args).catch(err => console.log(err));
    })
})

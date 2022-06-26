const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const { ImgurClient } = require("imgur");
// Create intents for discord bot so library is satisfied"
const intents = new Intents();
intents.add(
    Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
)
// Create a new client object, load the dotenv config and login as the bot
const client = new Client({
    intents: intents,
    partials: ["CHANNEL"]
});
dotenv.config();
client.login(process.env.token);

const bot = {
    client: client,
    fs: require("fs"),
    logger: require("./modules/logger.js"),
    utils: require("./modules/utils.js"),
    consts: require("./modules/constants.js"),
    sequelize: new Sequelize("database", "user", "password", {
        host: "localhost",
        dialect: "sqlite",
        logging: false,
        storage: "database.sqlite"
    }),
    db: {},
    imgur: new ImgurClient({ clientId: process.env.imgurId })
}
// Database for toggling features
bot.db.features = bot.sequelize.define("features", {
    guildId: {
        type: Sequelize.STRING,
        unique: true,
    },
    tiktokPreview: Sequelize.BOOLEAN,
    messagePreview: Sequelize.BOOLEAN,
    redditPreview: Sequelize.BOOLEAN
});
// Database for toggling commands
bot.db.commands = bot.sequelize.define("commands", {
    guildId: {
        type: Sequelize.STRING,
        unique: true,
    },
    disabled: Sequelize.STRING    
});
// Database for bot channel
bot.db.botChannels = bot.sequelize.define("bot_channels", {
    guildId: {
        type: Sequelize.STRING,
        unique: true
    },
    bot_channel: Sequelize.STRING
});

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

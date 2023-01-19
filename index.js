const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const { ImgurClient } = require('imgur');
// Create intents for discord bot so library is satisfied"
const intents = new Intents();
intents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MEMBERS,
);
// Create a new client object, load the dotenv config and login as the bot
const client = new Client({
	intents: intents,
	partials: ['CHANNEL'],
});
dotenv.config();
client.login(process.env.token);

const bot = {
	client: client,
	fs: require('fs'),
	logger: require('./modules/logger.js'),
	utils: require('./modules/utils.js'),
	consts: require('./modules/constants.js'),
	sequelize: new Sequelize('database', 'user', 'password', {
		host: 'localhost',
		dialect: 'sqlite',
		logging: false,
		storage: 'database.sqlite',
	}),
	db: {},
	imgur: new ImgurClient({ clientId: process.env.imgurId }),
	passthroughs: [],
	bridges: [],
	gifCache: {
		cuddle: [],
		hug: [],
		kiss: [],
		pat: [],
	},
};
// Database for toggling features
bot.db.features = bot.sequelize.define('features', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	tiktokPreview: Sequelize.BOOLEAN,
	messagePreview: Sequelize.BOOLEAN,
	redditPreview: Sequelize.BOOLEAN,
});
// Database for toggling commands
bot.db.commands = bot.sequelize.define('commands', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	disabled: Sequelize.STRING,
});
// Database for bot channel
bot.db.botChannels = bot.sequelize.define('bot_channels', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	bot_channel: Sequelize.STRING,
});

bot.db.marriages = bot.sequelize.define('marriages', {
	userId: Sequelize.STRING,
	spouseId: Sequelize.STRING,
	date: Sequelize.INTEGER,
});

bot.config = JSON.parse(bot.fs.readFileSync('./config.json'));

bot.commandGroups = bot.fs
	.readdirSync('./commands/', { withFileTypes: true })
	.filter((d) => d.isDirectory() && d.name !== 'admin')
	.map((d) => d.name);

bot.commands = new Map();

bot.commandGroups.forEach((group) => {
	const files = bot.fs
		.readdirSync(`./commands/${group}/`)
		.filter((file) => file.endsWith('.js'));

	files.forEach((file) => {
		const cmd = require(`./commands/${group}/${file}`);
		cmd.group = group;

		bot.commands.set(file.replace('.js', ''), cmd);
	});
});
// Read the directory containing commands and then add them to a map
/*
bot.commandFiles = bot.fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
bot.commands = new Map(
  bot.commandFiles.map((file) => [
    file.replace(".js", ""),
    require(`./commands/${file}`),
  ])
);
*/
const helpers = bot.fs
	.readdirSync('./modules/helpers')
	.filter((f) => f.endsWith('.js'));
bot.helpers = new Map(
	helpers.map((file) => [
		file.replace('.js', ''),
		require(`./modules/helpers/${file}`),
	]),
);

// Repeat for admin commands
bot.adminCommandFiles = bot.fs
	.readdirSync('./commands/admin/')
	.filter((file) => file.endsWith('.js'));
bot.adminCommands = new Map(
	bot.adminCommandFiles.map((file) => [
		file.replace('.js', ''),
		require(`./commands/admin/${file}`),
	]),
);
// Repeat, again, for events
bot.eventFiles = bot.fs
	.readdirSync('./events/')
	.filter((file) => file.endsWith('.js'));
bot.events = new Map(
	bot.eventFiles.map((file) => [
		file.replace('.js', ''),
		require(`./events/${file}`),
	]),
);

for (const [eventName, event] of bot.events) {
	bot.client.on(eventName, async (...args) => {
		try {
			await event.run(bot, ...args);
		}
		catch (err) {
			console.log(err);
		}
	});
}

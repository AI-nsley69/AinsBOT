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
};
// Table for toggling features
bot.db.features = bot.sequelize.define('features', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	tiktokPreview: Sequelize.BOOLEAN,
	messagePreview: Sequelize.BOOLEAN,
	redditPreview: Sequelize.BOOLEAN,
});
// Table for toggling commands
bot.db.commands = bot.sequelize.define('commands', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	disabled: Sequelize.STRING,
});
// Table for bot channel
bot.db.botChannels = bot.sequelize.define('bot_channels', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	},
	bot_channel: Sequelize.STRING,
});
// Table for marriages
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
bot.helpers = new Map();
bot.adminCommands = new Map();
bot.events = new Map();

let calls = 0;
bot.commandGroups.forEach((group) => {
	loadFiles('commands', `./commands/${group}`).then(calls += 1);
});
loadFiles('helpers', './modules/helpers').then(calls += 1);
loadFiles('adminCommands', './commands/admin').then(calls += 1);
loadFiles('events', './events').then(calls += 1);

// Wait for the functions to finish
while (calls < 4) {
	// Only check the calls count every 5 ms
	// eslint-disable-next-line no-empty-function
	setTimeout(() => {}, 5);
}

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

async function loadFiles(fieldName, path) {
	bot.fs.readdirSync(path).filter(f => f.endsWith('.js')).forEach(f => {
		bot[fieldName].set(f.replace('.js', ''), require(`${path}/${f}`));
	});
}

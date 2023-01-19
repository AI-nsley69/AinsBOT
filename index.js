const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const { ImgurClient } = require('imgur');

const time = performance.now();

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
	initTime: time,
};

// Used for parsing the table objects
const types = {
	'STRING': Sequelize.STRING,
	'INT': Sequelize.INTEGER,
	'BOOL': Sequelize.BOOLEAN,
};

const { features, commands, bot_channels, marriages } = JSON.parse(bot.fs.readFileSync('./tables.json'));

bot.config = JSON.parse(bot.fs.readFileSync('./config.json'));

bot.commandGroups = bot.fs
	.readdirSync('./commands/', { withFileTypes: true })
	.filter((d) => d.isDirectory() && d.name !== 'admin')
	.map((d) => d.name);

bot.commands = new Map();
bot.helpers = new Map();
bot.adminCommands = new Map();
bot.events = new Map();

const waits = [];

waits.push(loadTable('features', features, 'features'));
waits.push(loadTable('commands', commands, 'commands'));
waits.push(loadTable('bot_channels', bot_channels, 'botChannels'));
waits.push(loadTable('marriages', marriages, 'marriages'));

bot.commandGroups.forEach((group) => {
	waits.push(loadFiles('commands', `./commands/${group}`));
});
waits.push(loadFiles('helpers', './modules/helpers'));
waits.push(loadFiles('adminCommands', './commands/admin'));
waits.push(loadFiles('events', './events'));

Promise.all(waits).then(() => {
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
});

async function loadFiles(fieldName, path) {
	(await bot.fs.promises.readdir(path)).filter(f => f.endsWith('.js')).forEach(f => {
		bot[fieldName].set(f.replace('.js', ''), require(`${path}/${f}`));
	});
}

async function loadTable(name, input, field) {
	input = parseTableInput(input);
	bot.db[field] = bot.sequelize.define(name, input);
}

function parseTableInput(obj) {
	Object.keys(obj).forEach(key => {
		if (obj[key] instanceof Object) obj[key] = parseTableInput(obj[key]);
		else if (types[obj[key]]) obj[key] = types[obj[key]];
	});

	return obj;
}
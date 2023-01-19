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

// Used for parsing the table objects
const types = {
	'STRING': Sequelize.STRING,
	'INT': Sequelize.INTEGER,
	'BOOL': Sequelize.BOOLEAN,
};

const { features, commands, bot_channels, marriages } = JSON.parse(bot.fs.readFileSync('./tables.json'));

let defineCalls = 0;
loadTable('features', features, 'features').then(defineCalls++);
loadTable('commands', commands, 'commands').then(defineCalls++);
loadTable('bot_channels', bot_channels, 'botChannels').then(defineCalls++);
loadTable('marriages', marriages, 'marriages').then(defineCalls++);

bot.config = JSON.parse(bot.fs.readFileSync('./config.json'));

bot.commandGroups = bot.fs
	.readdirSync('./commands/', { withFileTypes: true })
	.filter((d) => d.isDirectory() && d.name !== 'admin')
	.map((d) => d.name);

bot.commands = new Map();
bot.helpers = new Map();
bot.adminCommands = new Map();
bot.events = new Map();

let loadCalls = 0;
bot.commandGroups.forEach((group) => {
	loadFiles('commands', `./commands/${group}`).then(loadCalls++);
});
loadFiles('helpers', './modules/helpers').then(loadCalls++);
loadFiles('adminCommands', './commands/admin').then(loadCalls++);
loadFiles('events', './events').then(loadCalls++);

const loadCallsLimit = 8;
const defineCallsLimit = 4;
// Wait for the functions to finish
while (loadCalls < loadCallsLimit || defineCalls < defineCallsLimit) {
	// Only check the loadCalls count every 5 ms
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

async function loadTable(name, input, field) {
	input = parseTableInput(input);
	bot.db[field] = await bot.sequelize.define(name, input);
}

function parseTableInput(obj) {
	Object.keys(obj).forEach(key => {
		if (obj[key] instanceof Object) obj[key] = parseTableInput(obj[key]);
		else if (types[obj[key]]) obj[key] = types[obj[key]];
	});

	return obj;
}
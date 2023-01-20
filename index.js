import { Client, Intents } from 'discord.js';
// const { Client, Intents } = require('discord.js');
import dotenv from 'dotenv';
// const dotenv = require('dotenv');
import sequelize from 'sequelize';
// const sequelize = require('sequelize');
import pkg from 'imgur';
const { ImgurClient } = pkg;
// const { ImgurClient } = require('imgur');
import fs from 'fs';

import logger from './modules/logger.js';
import utils from './modules/utils.js';
import consts from './modules/constants.js';

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
	fs: fs,
	logger: logger,
	utils: utils,
	consts: consts,
	sequelize: new sequelize('database', 'user', 'password', {
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
	'STRING': sequelize.STRING,
	'INT': sequelize.INTEGER,
	'BOOL': sequelize.BOOLEAN,
};

const { features, commands, bot_channels, marriages } = JSON.parse(bot.fs.readFileSync('./tables.json'));

bot.config = JSON.parse(fs.readFileSync('./config.json'));

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
	waits.push(loadFiles('commands', `./commands/${group}`, true, group));
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

async function loadFiles(fieldName, path, addGroup = false, group = '') {
	const files = (await bot.fs.promises.readdir(path)).filter(f => f.endsWith('.js'));
	const promises = files.map(async f => {
		const file = await import(`${path}/${f}`);
		if (addGroup) file.default.group = group;
		bot[fieldName].set(f.replace('.js', ''), file.default);
	});

	await Promise.all(promises);
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
import { Client, Intents } from 'discord.js';
import fs from 'fs';
import sequelize from 'sequelize';
import imgur from 'imgur';
const { ImgurClient } = imgur;

import { Cache } from './cache.js';
import { Logger } from './logger.js';
import { Command } from './commandClass.js';

export class Bot {
	constructor(promises) {
		this.initTime = performance.now();
		this.config = JSON.parse(fs.readFileSync('./config.json'));
		this.loadModules();

		this.initializeClient();
		this.initializeThirdParty();
		promises.push(this.initializeDatabase());

		promises.push(this.loadCommands());
		promises.push(this.loadEvents());
		promises.push(this.loadHelpers());
	}


	loadModules() {
		this.logger = new Logger(this.config.logLevel, './latest.log');
	}

	initializeClient() {
		const intents = new Intents();
		intents.add(
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.DIRECT_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MEMBERS,
		);

		this.client = new Client({
			intents: intents,
			partials: ['CHANNEL'],
		});
	}

	initializeThirdParty() {
		this.imgur = new ImgurClient({ clientId: process.env.imgurId });
	}

	async initializeDatabase() {
		const { features, commands, bot_channels, marriages } = JSON.parse(fs.readFileSync('./tables.json'));

		this.sequelize = new sequelize('database', 'user', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: 'database.sqlite',
		});

		this.db = {};
		this.passthroughs = [];
		this.bridges = [];

		const waits = [];
		waits.push(loadTable(this, 'features', features, 'features'));
		waits.push(loadTable(this, 'commands', commands, 'commands'));
		waits.push(loadTable(this, 'bot_channels', bot_channels, 'botChannels'));
		waits.push(loadTable(this, 'marriages', marriages, 'marriages'));
		await Promise.all(waits);

		this.cache = new Cache(this);
	}

	async loadCommands() {
		const promises = [];
		// Setup commands
		this.commandGroups = fs.readdirSync('./commands/', { withFileTypes: true })
			.filter(d => d.isDirectory() && d.name !== 'admin')
			.map(d => d.name);
		this.commands = new Map();
		this.commandGroups.forEach(group => {
			const path = `./commands/${group}`;
			promises.push(loadFiles(this.commands, path, true, group));
		});
		// Setup admin commands
		this.adminCommands = new Map();
		promises.push(loadFiles(this.adminCommands, './commands/admin'));

		await Promise.all(promises);

		validateCommands(this, this.commands);
	}

	async loadEvents() {
		this.events = new Map();
		await loadFiles(this.events, './events/');
	}

	async loadHelpers() {
		this.helpers = new Map();
		await loadFiles(this.helpers, './modules/helpers');
	}
}

function validateCommands(bot, commands) {
	for (const [name, command] of commands) {
		if (!(command instanceof Command)) {
			bot.logger.err(
				`Invalid command structure for the ${name} command. Please use the newcmd script to remake this command.`,
			);
			return;
		}
		if (!command.run) bot.logger.err(`Invalid run function for the ${name} command!`);
	}
}

async function loadFiles(map, path, addGroup = false, group = '') {
	const files = (await fs.promises.readdir(path)).filter(f => f.endsWith('.js'));
	const promises = files.map(async f => {
		const file = await import(`../${path}/${f}`);
		if (addGroup) file.default.group = group;
		map.set(f.replace('.js', ''), file.default);
	});

	await Promise.all(promises);

	return map;
}

async function loadTable(bot, name, input, field) {
	input = parseTableInput(input);
	bot.db[field] = await bot.sequelize.define(name, input);
}

const types = {
	'STRING': sequelize.STRING,
	'INT': sequelize.INTEGER,
	'BOOL': sequelize.BOOLEAN,
};

function parseTableInput(obj) {
	Object.keys(obj).forEach(key => {
		if (obj[key] instanceof Object) obj[key] = parseTableInput(obj[key]);
		else if (types[obj[key]]) obj[key] = types[obj[key]];
	});

	return obj;
}
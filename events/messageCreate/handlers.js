import { TextContext } from '../../modules/context.js';
import { csvToArr } from '../../modules/utils.js';
import { argParser } from '../messageCreate/arguments.js';

// Add cooldown for commands
const cmdCooldown = new Set();

function isAdminCommand(bot, message) {
	return message.content.startsWith(bot.config.adminPrefix);
}

function isCommand(bot, message) {
	return message.content.startsWith(bot.config.prefix);
}

async function isGuild(message) {
	return message.guild ? true : false;
}

async function isBotChannel(bot, message) {
	// Return true if the message is sent in a non-guild chat
	if (!isGuild(message)) return true;

	const query = await bot.db.botChannels.findAll({
		where: {
			guildId: message.guild.id,

		},
	});
	// Check if the query returned a response, otherwise return true if no bot channel is set
	if (query[0]) {
		const botChannel = query[0].dataValues.bot_channel;
		return message.channel.id === botChannel;
	}
	else {
		return true;
	}
}

async function isCommandEnabled(bot, message, command) {
	if (!isGuild) return true;

	const query = await bot.cache.queryDb('commands', message.guild.id, { where: {
		guildId: message.guild.id,
	} });

	if (!query || !query.disabled) return true;

	const disabledCommands = csvToArr(query.disabled);
	return !disabledCommands.includes(command);
}

async function commandHandler(bot, message) {
	// Only react to messages that start with our prefix
	if (!isCommand(bot, message)) return;
	const args = message.content
		.slice(bot.config.prefix.length)
		.trim()
		.split(/ +/);
	const command = args.shift().toLowerCase();
	const argsConcat = args.join(' ');

	const isValidCommand = bot.commands.has(command);
	if (!isValidCommand) return;

	const commandInfo = bot.commands.get(command);
	const isUserOnCooldown = cmdCooldown.has(`${message.author.id}-${command}`);
	if (isUserOnCooldown) {return message.react('⏳');}

	const ctx = new TextContext(message);

	if (!(await isBotChannel(bot, message))) return;

	if (!(await isCommandEnabled(bot, message, command))) {
		return ctx.err('This command is not enabled in this guild! ❌');
	}

	const hasRequiredPermission = !(commandInfo.permission && !message.member.permissions.has(commandInfo.permission));
	if (!hasRequiredPermission) {
		return ctx.err('You do not have the permission to run this command! ❌');
	}

	const missingPerms = commandInfo.botPermissions.filter((perm) => {
		message.guild ? !message.guild.me.permissions.has(perm) : false;
	});

	const isBotMissingPerms = missingPerms.length > 0;
	if (isBotMissingPerms) {
		return ctx.err(`I am missing the needed commands to run this command ):\nPlease give me the following permissions:\`${missingPerms.join(', ')}\``);
	}

	const canRunInContext = !(commandInfo.guild && !message.guild);
	if (!canRunInContext) {
		return ctx.err('This command is only available in guilds 🌧');
	}

	const ctxArgs = await argParser(bot, args, commandInfo.args).catch(err => {
		ctx.err(err.toString());
		bot.logger.verbose(err.toString());
	});

	if (!ctxArgs) return;
	ctx.setArgs(ctxArgs);

	bot.logger.verbose(
		`${message.author.tag} ran ${command} with ${
			argsConcat.length > 0 ? argsConcat : 'no'
		} arguments!`,
	);

	try {
		await ctx.getChannel().sendTyping();

		await commandInfo.run(bot, ctx);
		const shouldSetCooldown = commandInfo.cooldown > 0 && !ctx.cancelCooldown();
		if (!shouldSetCooldown) return;

		cmdCooldown.add(`${message.author.id}-${command}`);
		setTimeout(() => {
			cmdCooldown.delete(`${message.author.id}-${command}`);
		}, commandInfo.cooldown * 1000);
	}
	catch (err) {
		bot.logger.err(err);
		ctx.err(err);
	}
}

async function adminCommandHandler(bot, message) {
	// Only react to messages that start with the admin prefix
	if (!isAdminCommand(bot, message)) return;
	// Get the arguments and attempted command
	const args = message.content
		.slice(bot.config.adminPrefix.length)
		.trim()
		.split(/ +/);
	const command = args.shift().toLowerCase();
	// Check if command exists
	if (!bot.adminCommands.has(command)) return;
	// Get the command from the map
	const commandInfo = bot.adminCommands.get(command);

	const ctx = new TextContext(message);
	// If the author is not in the array of admin ids, return a message letting them know they're not allowed to run this command
	if (!bot.config.adminIds.includes(message.author.id)) {
		ctx.err('doas: Operation not permitted');
		bot.logger.warn(
			`${message.author.tag} tried to run an admin command!`,
		);
		return;
	}

	const ctxArgs = await argParser(bot, args, commandInfo.args).catch(err => {
		ctx.err(err.toString());
		bot.logger.verbose(err.toString());
	});
	if (!ctxArgs) return;
	ctx.setArgs(ctxArgs);

	// Run command
	commandInfo.run(bot, ctx).catch((err) => {
		ctx.err(`${err}`);
		bot.logger.err(err);
	});
}

export { commandHandler, adminCommandHandler };
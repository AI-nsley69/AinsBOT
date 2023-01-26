import { TextContext } from '../../modules/context.js';
import { argParser } from '../messageCreate/arguments.js';

// Add cooldown for commands
const cmdCooldown = new Set();

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

	const query = await bot.db.commands.findAll({
		where: { guildId: message.guild.id },
	});

	if (query[0]) {
		const disabledCommands = bot.utils.csvToArr(query[0].dataValues.disabled);
		return !disabledCommands.includes(command);
	}
	else {
		return true;
	}
}

async function commandHandler(bot, message) {
	// Only react to messages that start with our prefix
	if (message.content.startsWith(bot.config.prefix)) {
		const args = message.content
			.slice(bot.config.prefix.length)
			.trim()
			.split(/ +/);
		const command = args.shift().toLowerCase();

		// Ignore if command doesn't exist, otherwise grab it in a constant
		if (!bot.commands.has(command)) return;
		const commandInfo = bot.commands.get(command);

		// Check if user has cooldown on said command
		if (cmdCooldown.has(`${message.author.id}-${command}`)) {return message.react('⏳');}

		// Setup context for the command
		const ctx = new TextContext(message);
		const ctxArgs = await argParser(bot, args, commandInfo.args).catch(err => {
			ctx.err(ctx, err.toString());
			bot.logger.verbose(bot, err.toString());
		});
		if (!ctxArgs) return;
		ctx.setArgs(ctxArgs);

		// Check if the command is ran in the bot channel
		if (!(await isBotChannel(bot, message))) return;

		// Check if the command is enabled
		if (!(await isCommandEnabled(bot, message, command))) {
			return ctx.err('This command is not enabled in this guild! ❌');
		}
		// Check if the user has the required permission, if wanted
		if (
			commandInfo.permission &&
      !message.member.permissions.has(commandInfo.permission)
		) {
			return bot.utils.softErr(
				bot,
				message,
				'You do not have the permission to run this command! ❌',
			);
		}

		// Check if bot has the required permissions for the command
		const missingPerms = commandInfo.botPermissions.filter((perm) =>
			message.guild ? !message.guild.me.permissions.has(perm) : false,
		);
		if (missingPerms.length > 0) {
			return bot.utils.softErr(
				bot,
				message,
				`I am missing the needed commands to run this command ):\nPlease give me the following permissions:\`${missingPerms.join(
					', ',
				)}\``,
			);
		}

		// Check if the message is from a guild, if wanted
		if (commandInfo.guild && !message.guild) {
			return bot.utils.softErr(
				bot,
				message,
				'This command is only available in guilds 🌧',
			);
		}

		// Run the command and catch any error to not crash bot
		bot.logger.verbose(
			bot,
			`${message.author.tag} ran ${command} command with ${
				args.length > 0 ? args.join(' ') : 'no'
			} arguments!`,
		);

		await ctx.getChannel().sendTyping();

		commandInfo.run(bot, ctx).catch((err) => {
			ctx.err(ctx, err.toString());
			console.log(err);
			bot.logger.err(bot, err);
		});

		// Add user to cooldown if enabled
		if (commandInfo.cooldown < 0) return;
		cmdCooldown.add(`${message.author.id}-${command}`);
		setTimeout(() => {
			cmdCooldown.delete(`${message.author.id}-${command}`);
			// Cooldown is specified in seconds
		}, commandInfo.cooldown * 1000);
	}
}

async function adminCommandHandler(bot, message) {
	// Only react to messages that start with the admin prefix
	if (message.content.startsWith(bot.config.adminPrefix)) {
		// Get the arguments and attempted command
		const args = message.content
			.slice(bot.config.adminPrefix.length)
			.trim()
			.split(/ +/);
		const command = args.shift().toLowerCase();
		// Check if command exists
		if (!bot.adminCommands.has(command)) return;
		// If the author is not in the array of admin ids, return a message letting them know they're not allowed to run this command
		if (!bot.config.adminIds.includes(message.author.id)) {
			bot.utils.softErr(bot, message, 'doas: Operation not permitted');
			bot.logger.warn(
				bot,
				`${message.author.tag} tried to run an admin command!`,
			);
			return;
		}
		// Get the command from the map
		const commandInfo = bot.adminCommands.get(command);
		// Run command
		commandInfo.run(bot, message, args).catch((err) => {
			bot.utils.softErr(bot, message, `${err}`);
			bot.logger.err(bot, err);
		});
	}
}

export { commandHandler, adminCommandHandler };
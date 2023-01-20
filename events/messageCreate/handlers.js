// Add cooldown for commands
const cmdCooldown = new Set();

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
		// Check if the command is ran in the bot channel
		const botChannel = await bot.db.botChannels.findAll({
			where: { guildId: message.guild ? message.guild.id : null },
		});
		const correctChannel = botChannel[0]
			? botChannel[0].dataValues.bot_channel
			: null;
		if (correctChannel && correctChannel !== message.channel.id) return;
		// Check if the command is enabled
		const query = await bot.db.commands.findAll({
			where: { guildId: message.guild ? message.guild.id : null },
		});
		const disabledArr = query[0]
			? bot.utils.csvToArr(query[0].dataValues.disabled)
			: [];
		if (disabledArr.includes(command)) {
			return bot.utils.softErr(
				bot,
				message,
				'This command is not enabled in this guild! ❌',
			);
		}
		// Check if user has cooldown on said command
		if (cmdCooldown.has(`${message.author.id}-${command}`)) {return message.react('⏳');}
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
		/*
    // Regex for getting required and optional args
    const requiredRegex = /\[.*?\]/g;
    const optionalRegex = /\(.*?\)/g;
    // Validate argument count
    const minArgs = commandInfo.usage.match(requiredRegex) || [];
    const maxArgs = minArgs + commandInfo.usage.match(optionalRegex) || [];
    if (args.length < minArgs.length) {
      // Too few arguments
      return bot.utils.softErr(
        bot,
        message,
        "Too few arguments provided! Please provide the required arguments and try again."
      );
    } else if (args.length > maxArgs.length) {
      // Too many arguments
      return bot.utils.softErr(
        bot,
        message,
        "Too many arguments provided! Please provide the required arguments and try again."
      );
    }
    */
		// Run the command and catch any error to not crash bot
		const loadingMsg = await bot.utils.cmdLoadingMsg(bot, message);
		bot.logger.verbose(
			bot,
			`${message.author.tag} ran ${command} command with ${
				args.length > 0 ? args.join(' ') : 'no'
			} arguments!`,
		);
		await commandInfo.run(bot, message, loadingMsg, args).catch((err) => {
			bot.utils.handleCmdError(bot, message, loadingMsg, `${err}`);
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
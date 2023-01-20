import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Purge the last n messages!')
	.setUsage('[amount]')
	.setPermission('MANAGE_MESSAGES')
	.setBotPermission(['MANAGE_MESSAGES'])
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, message, loadingMsg, args) => {
		// Immediately delete the loading message
		await loadingMsg.delete();
		// Validate the amount
		if (!args) return bot.utils.softErr(bot, message, 'You have to give an amount!', loadingMsg);
		let amount = parseInt(args[0], 10);
		if (!amount || amount > 2000 || amount < 1) return bot.utils.softErr(bot, message, 'Amount is not a number, or is more than 2000 or is less than 1.');
		// Clear messages in bulk of 100
		const rest = amount % 100;
		amount -= rest;

		for (;amount > 0; amount -= 100) {
			await message.channel.bulkDelete(100);
		}

		if (rest != 0) await message.channel.bulkDelete(rest);
	});
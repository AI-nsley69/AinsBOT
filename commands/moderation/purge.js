import { Command, ReqArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Purge the last n messages!')
	.setUsage('[amount]')
	.setArgs({
		amount: ReqArg.String,
	})
	.setPermission('MANAGE_MESSAGES')
	.setBotPermission(['MANAGE_MESSAGES'])
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
		// Immediately delete the loading message
		// Validate the amount
		let amount = ctx.getArgs().amount;
		amount = parseInt(amount, 10);
		if (!amount || amount > 2000 || amount < 1) return ctx.err('Amount is not a number, or is more than 2000 or is less than 1.');
		// Clear messages in bulk of 100
		const rest = amount % 100;
		amount -= rest;

		for (;amount > 0; amount -= 100) {
			await ctx.getChannel().bulkDelete(100);
		}

		if (rest != 0) await ctx.getChannel().bulkDelete(rest);
	});
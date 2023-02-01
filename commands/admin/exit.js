import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('kill the bot')
	.setRun(async (bot, ctx) => {
		bot.logger.verbose(`Bot shutdown by ${ctx.getAuthor().tag}`);
		await ctx.message('Shutting down..');
		process.exit();
	});
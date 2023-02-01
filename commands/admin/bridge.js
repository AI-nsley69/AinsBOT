import { Command, OptArg, ReqArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Channel Bridging')
	.setUsage('[src] (dest)')
	.setArgs({
		source: ReqArg.String,
		destination: OptArg.String,
	})
	.setRun(async (bot, ctx) => {
	// Deconstruct args and try to fetch them
		const { source, destination } = ctx.getArgs();
		const srcChannel = await bot.client.channels.fetch(source);
		const destChannel = destination ? await bot.client.channels.fetch(destination) : ctx.getChannel();
		// Check if channels exist
		if (!srcChannel) {return ctx.err('Invalid source channel!');}
		if (!destChannel) {return ctx.err('Invalid destination channel!');}
		// If the passthrough already exists, remove it
		const arr = bot.bridges.filter(pair => pair.includes(srcChannel.id));
		if (arr.length !== 0) {
			bot.bridges = bot.bridges.filter(pair => !pair.includes(srcChannel.id));

			ctx.message('Successfully removed bridge channel!');
		}
		else {
			bot.bridges.push([
				srcChannel.id,
				destChannel.id,
			]);

			ctx.message('Successfully added new bridge channel!');
		}
	});

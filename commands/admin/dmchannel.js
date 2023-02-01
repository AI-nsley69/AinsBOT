import { Command, ReqArg } from '../../modules/commandClass.js';
import { TextContext } from '../../modules/context.js';

export default new Command()
	.setDescription('Get dm channel id from bot')
	.setArgs({
		target: ReqArg.User,
	})
	.setRun(async (bot, ctx) => {
		// Taking the L if it can't delete message
		if (ctx instanceof TextContext) ctx.msg.delete().catch(L => L);
		const { target } = ctx.getArgs();
		// Fetch the channel, return if it doesn't exist
		const channel = await target.createDM();
		if (!channel) {return;}
		// Dm the author if everything goes smoothly
		ctx.getAuthor().send(`Target: ${target.tag}\nDM: ${channel.id}`);
	});
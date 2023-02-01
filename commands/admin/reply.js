import { Command, ReqArg } from '../../modules/commandClass.js';
import { TextContext } from '../../modules/context.js';

export default new Command()
	.setDescription('Reply with to a message with given string')
	.setUsage('[msg id to respond to] [string to repeat]')
	.setArgs({
		targetId: ReqArg.String,
		content: ReqArg.StringCoalescing,
	})
	.setRun(async (bot, ctx) => {
		if (!(ctx instanceof TextContext)) return;
		ctx.msg.delete().catch(err => bot.logger.warn(err));
		const targetMsgId = ctx.getArgs().targetId;
		// Get the message
		const msg = await ctx.getChannel().messages.fetch(targetMsgId);
		// Check if we got the message, if so reply to it, otherwise let the author know
		if (msg) {msg.reply(ctx.getArgs().content);}
		else {ctx.err('Could not find message!');}
	});
import { Command, ReqArg } from '../../modules/commandClass.js';
import { TextContext } from '../../modules/context.js';

export default new Command()
	.setDescription('Repeat all the arguments')
	.setUsage('[string to repeat]')
	.setArgs({
		content: ReqArg.StringCoalescing,
	})
	.setRun(async (bot, ctx) => {
		if (ctx instanceof TextContext) ctx.msg.delete().catch(err => bot.logger.warn(err));
		ctx.respond(ctx.getArgs().content);
	});
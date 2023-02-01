import { Command, ReqArg } from '../../modules/commandClass.js';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../modules/constants.js';

export default new Command()
	.setDescription('New command!')
	.setArgs({
		code: ReqArg.StringCoalescing,
	})
	.setRun(async (bot, ctx) => {
		try {
			// evaluate the input, then clean it
			let output = await eval(ctx.getArgs().code);
			output = cleanOutput(bot, ctx, output.toString());
			// Set up embed
			const embed = new MessageEmbed()
				.setTitle('🖥️ Eval response!')
				.setColor(Colors.SUCCESS)
				.setAuthor({
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setDescription('```' + output + '```')
				.setTimestamp();
			// Reply with the embed
			ctx.embed([embed]);
		}
		catch (err) {
			// Error embed
			const embed = new MessageEmbed()
				.setTitle('❌ Eval failed!')
				.setColor(Colors.ERR)
				.setAuthor({
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setDescription('```' + err + '```')
				.setTimestamp();

			ctx.embed([embed]);
		}
	});

function cleanOutput(bot, ctx, output) {
	bot.logger.warn(`${ctx.getAuthor().tag} ran eval with the following output:\n${output}`);
	return output.replaceAll(process.env.token, '[REDACTED]');
}
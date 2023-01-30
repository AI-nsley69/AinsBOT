import { MessageEmbed } from 'discord.js';
import translate from 'translate-google';
import { Command, OptArg } from '../../modules/commandClass.js';
import { TextContext } from '../../modules/context.js';
import { Colors } from '../../modules/constants.js';

export default new Command()
	.setDescription('Translates a message to english')
	.setUsage('[text or reply]')
	.setArgs({
		text: OptArg.StringCoalescing,
	})
	.setCooldown(3)
	.setRun(async (bot, ctx) => {
		// Check if there's a message reference or any string to translate
		if (ctx instanceof TextContext
			&& ctx.getArgs().text.length < 1
			&& !ctx._src.reference
		) return ctx.err(ctx, 'Missing text/reply to translate!');

		// Get message object if it exists, otherwise make it null
		const msg = ctx._src.reference ? (await ctx.getChannel().messages.fetch(ctx._src.reference.messageId)) : null;
		// Check the referenced msg content if it exists, otherwise just join the arguments to a string
		const toTranslate = msg ? msg.content : ctx.getArgs().text;
		// Translate the message
		const translated = await translate(toTranslate, { to: 'en' });
		// Create an embed with the translated message
		const embed = new MessageEmbed()
			.setTitle('Google Translate!')
			.setColor(Colors.TRANSLATE)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.addFields([
				{
					name: 'Original',
					// We slice to fit the field character limit
					value: toTranslate.slice(0, 1023),
				},
				{
					name: 'Translated',
					value: translated.slice(0, 1023),
				},
			])
			.setTimestamp();
		// Edit the temp message
		ctx.embed([embed]);
	});
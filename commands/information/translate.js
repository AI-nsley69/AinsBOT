import { MessageEmbed } from 'discord.js';
import translate from 'translate-google';
import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Translates a message to english')
	.setUsage('[text or reply]')
	.setCooldown(3)
	.setRun(async (bot, message, loadingMsg, args) => {
	// Check if there's a message reference or any string to translate
		if (!message.reference && !args) {return bot.utils.softErr(bot, message, 'Please reply to a message or give text to translate!', loadingMsg);}
		// Get message object if it exists, otherwise make it null
		const msg = message.reference ? (await message.channel.messages.fetch(message.reference.messageId)) : null;
		// Check the referenced msg content if it exists, otherwise just join the arguments to a string
		const toTranslate = msg ? msg.content : args.join(' ');
		// Translate the message
		const translated = await translate(toTranslate, { to: 'en' });
		// Create an embed with the translated message
		const embed = new MessageEmbed()
			.setTitle('Google Translate!')
			.setColor(bot.consts.Colors.TRANSLATE)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
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
		loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, loadingMsg, err));
	});
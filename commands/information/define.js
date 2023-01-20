import { MessageEmbed } from 'discord.js';
import ud from 'relevant-urban';
import { Command } from '../../modules/commandClass.js';
const { random } = ud;

export default new Command()
	.setDescription('Looks up the definition of a word on Urban Dictionary')
	.setUsage('(word)')
	.setRun(async (bot, message, loadingMsg, args) => {
		const [word] = args;
		const def = word ? await ud(args.join(' ')) : random();

		const embed = new MessageEmbed()
			.setTitle(def.word)
			.setURL(def.urbanURL)
			.setAuthor({
				name: def.author,
			})
			.addFields([
				{
					name: 'Description',
					value: def.definition,
					inline: false,
				},
				{
					name: 'Example',
					value: def.example,
					inline: false,
				},
			])
			.setColor(bot.consts.Colors.INFO)
			.setFooter({
				text: `👍 ${def.thumbsUp} 👎 ${def.thumbsDown}`,
			});

		loadingMsg.edit({ embeds: [embed] });
	});
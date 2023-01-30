import { MessageEmbed } from 'discord.js';
import ud from 'relevant-urban';
import { Command, OptArg } from '../../modules/commandClass.js';
import { Colors } from '../../modules/constants.js';
const { random } = ud;

export default new Command()
	.setDescription('Looks up the definition of a word on Urban Dictionary')
	.setUsage('(word)')
	.setArgs({
		word: OptArg.StringCoalescing,
	})
	.setRun(async (bot, ctx) => {
		const word = ctx.getArgs().word;
		const def = word ? await ud(word) : await random();
		let defString = def.definition;
		let defExample = def.example;
		if (defString.length >= 1024) defString = defString.substring(0, 1024);
		if (defExample.length >= 1024) defExample = defExample.substring(0, 1024);

		const embed = new MessageEmbed()
			.setTitle(def.word)
			.setURL(def.urbanURL)
			.setAuthor({
				name: def.author,
			})
			.addFields([
				{
					name: 'Description',
					value: defString,
					inline: false,
				},
				{
					name: 'Example',
					value: defExample,
					inline: false,
				},
			])
			.setColor(Colors.INFO)
			.setFooter({
				text: `👍 ${def.thumbsUp} 👎 ${def.thumbsDown}`,
			});

		ctx.embed([embed]);
	});
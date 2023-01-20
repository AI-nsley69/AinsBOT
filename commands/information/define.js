import { MessageEmbed } from 'discord.js';
import ud from 'relevant-urban';
const { random } = ud;


const description = 'Looks up the definition of a word on Urban Dictionary';
const usage = '(word)';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 0;
async function run(bot, message, loadingMsg, args) {
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
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
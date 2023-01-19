const { MessageEmbed } = require('discord.js');
const ud = require('relevant-urban');

module.exports = {
	description: 'Looks up the definition of a word on Urban Dictionary',
	usage: '(word)',
	permission: null,
	botPermissions: [],
	guild: false,
	cooldown: 0,
	run: async (bot, message, loadingMsg, args) => {
		const [word] = args;
		const def = word ? await ud(args.join(' ')) : ud.random();

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
	},
};

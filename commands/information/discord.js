const { MessageEmbed } = require('discord.js');

module.exports = {
	description: 'Ping pong!',
	usage: '',
	permission: null,
	botPermissions: [],
	guild: false,
	cooldown: 0,
	run: async (bot, message, loadingMsg) => {
		if (!process.env.inviteLink) return bot.utils.softErr(bot, message, 'No invite link is configured!', loadingMsg);
		const embed = new MessageEmbed()
			.setTitle(`${bot.client.user.username}'s server!`)
			.setURL(process.env.inviteLink)
			.setColor(bot.consts.Colors.INFO);

		loadingMsg.edit({ embeds: [embed] });
	},
};

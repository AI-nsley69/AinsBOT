const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	description: 'Kiss a user!',
	usage: '[user]',
	permission: null,
	botPermissions: [],
	guild: true,
	cooldown: 5,
	run: async (bot, message, loadingMsg) => {
		// Verify that we have a user to hug and if it is valid
		const member = message.mentions.members.first();
		if (!member) return bot.utils.softErr(bot, message, 'Awh.. got no one to kiss? ):', loadingMsg);
		if (member.user.id === message.author.id) return bot.utils.softErr(bot, message, 'You can\'t kiss yourself silly!', loadingMsg);
		// Fetch the media
		const kiss = await axios.get('https://api.otakugifs.xyz/gif?reaction=kiss&format=gif');
		// Embed to send
		const embed = new MessageEmbed()
			.setTitle(`${member.user.tag} got kissed by ${message.author.tag}!`)
			.setColor(bot.consts.Colors.INFO)
			.setImage(kiss.data.url)
			.setTimestamp();
		// Edit message to include the new embed
		loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, null, err, loadingMsg));
	},
};

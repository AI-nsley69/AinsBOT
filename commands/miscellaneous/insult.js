const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	description: 'Get a random insult',
	usage: '',
	permission: null,
	botPermissions: [],
	guild: false,
	cooldown: 15000,
	run: async (bot, message, loadingMsg) => {
		const insult = await axios.get('https://insult.mattbas.org/api/insult').then(r => r.data);
		// Create the message embed
		const embed = new MessageEmbed()
			.setTitle('An insult:tm:')
			.setColor(bot.consts.Colors.INFO)
			.setDescription(insult);

		loadingMsg.edit({ embeds: [embed] });
	},
};

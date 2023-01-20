import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Get the invite link to the official server!')
	.setRun(async (bot, message, loadingMsg) => {
		if (!process.env.inviteLink) {return bot.utils.softErr(bot, message, 'No invite link is configured!', loadingMsg);}
		const embed = new MessageEmbed()
			.setTitle(`${bot.client.user.username}'s server!`)
			.setURL(process.env.inviteLink)
			.setColor(bot.consts.Colors.INFO);

		loadingMsg.edit({ embeds: [embed] });
	});
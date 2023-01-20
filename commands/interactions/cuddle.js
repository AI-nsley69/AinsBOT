import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Cuddle a user!')
	.setUsage('[user]')
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, message, loadingMsg) => {
	// Verify that we have a user to hug and if it is valid
		const member = message.mentions.members.first();
		if (!member) {
			return bot.utils.softErr(
				bot,
				message,
				'Awh.. got no one to cuddle? ):',
				loadingMsg);
		}
		if (member.user.id === message.author.id) {
			return bot.utils.softErr(
				bot,
				message,
				'You can\'t cuddle yourself silly!',
				loadingMsg);
		}
		// Fetch the media
		const cuddle = await get('https://api.otakugifs.xyz/gif?reaction=cuddle&format=gif')
			.then((res) => res.data.url);

		sendEmbed(bot, loadingMsg, member, message, cuddle);
	});

function sendEmbed(bot, loadingMsg, member, message, cuddle) {
	// Create a new embed to send
	const embed = new MessageEmbed()
		.setTitle(`${member.user.tag} got cuddled by ${message.author.tag}!`)
		.setColor(bot.consts.Colors.INFO)
		.setImage(cuddle)
		.setTimestamp();
	// Send the new embed
	loadingMsg
		.edit({ embeds: [embed] })
		.catch((err) => bot.utils.handleCmdError(bot, message, null, err));
}
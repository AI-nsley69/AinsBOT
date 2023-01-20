import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Hug a user!')
	.setUsage('[user]')
	.setGuild(true)
	.setCooldown(15)
	.setRun(async (bot, message, loadingMsg) => {
	// Verify that we have a user to hug and if it is valid
		const member = message.mentions.members.first();
		if (!member) {return bot.utils.softErr(bot, message, 'Awh.. got no one to hug? ):', loadingMsg);}
		if (member.user.id === message.author.id) {return bot.utils.softErr(bot, message, 'You can\'t hug yourself silly!', loadingMsg);}
		// Fetch the media
		const hug = await get('https://some-random-api.ml/animu/hug');
		const icon = await get('https://some-random-api.ml/img/red_panda');
		// Embed to send
		const embed = new MessageEmbed()
			.setTitle(`${member.user.tag} received a hug from ${message.author.tag}!`)
			.setThumbnail(icon.data.link)
			.setColor(bot.consts.Colors.INFO)
			.setImage(hug.data.link)
			.setTimestamp();
		// Edit message to include the new embed
		loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, null, err, loadingMsg));
	});
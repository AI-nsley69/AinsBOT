import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Pat a user!')
	.setUsage('[user]')
	.setGuild(true)
	.setCooldown(15)
	.setRun(async (bot, message, loadingMsg) => {
	// Verify user
		const member = message.mentions.members.first();
		if (!member) {return bot.utils.softErr(bot, message, 'Awh.. got no one to pat? ):', loadingMsg);}
		if (member.user.id === message.author.id) {return bot.utils.softErr(bot, message, 'You can\'t pat yourself silly!', loadingMsg);}
		// Fetch from api
		const pat = await get('https://some-random-api.ml/animu/pat');
		const icon = await get('https://some-random-api.ml/img/koala');
		// Create embed
		const embed = new MessageEmbed()
			.setTitle(`${message.author.tag} gave ${member.user.tag} a pat!`)
			.setThumbnail(icon.data.link)
			.setColor(bot.consts.Colors.INFO)
			.setImage(pat.data.link)
			.setTimestamp();

		loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, null, err, loadingMsg));
	});
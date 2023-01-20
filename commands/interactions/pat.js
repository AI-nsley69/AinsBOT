import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;

const description = 'Pat a user!';
const usage = '[user]';
const permission = null;
const botPermissions = [];
const guild = true;
const cooldown = 5;
async function run(bot, message, loadingMsg) {
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
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
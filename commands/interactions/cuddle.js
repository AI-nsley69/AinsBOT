import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;


const description = 'Cuddle a user!';
const usage = '[user]';
const permission = null;
const botPermissions = [];
const guild = true;
const cooldown = 5;
async function run(bot, message, loadingMsg) {
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
}

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

export default { description, usage, permission, botPermissions, guild, cooldown, run };
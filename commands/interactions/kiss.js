import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;


const description = 'Kiss a user!';
const usage = '[user]';
const permission = null;
const botPermissions = [];
const guild = true;
const cooldown = 5;
async function run(bot, message, loadingMsg) {
	// Verify that we have a user to hug and if it is valid
	const member = message.mentions.members.first();
	if (!member) {return bot.utils.softErr(bot, message, 'Awh.. got no one to kiss? ):', loadingMsg);}
	if (member.user.id === message.author.id) {return bot.utils.softErr(bot, message, 'You can\'t kiss yourself silly!', loadingMsg);}
	// Fetch the media
	const kiss = await get('https://api.otakugifs.xyz/gif?reaction=kiss&format=gif');
	// Embed to send
	const embed = new MessageEmbed()
		.setTitle(`${member.user.tag} got kissed by ${message.author.tag}!`)
		.setColor(bot.consts.Colors.INFO)
		.setImage(kiss.data.url)
		.setTimestamp();
	// Edit message to include the new embed
	loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, null, err, loadingMsg));
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
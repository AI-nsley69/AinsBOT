import { MessageEmbed } from 'discord.js';


const description = 'Ping pong!';
const usage = '';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 0;
async function run(bot, message, loadingMsg) {
	if (!process.env.inviteLink) {return bot.utils.softErr(bot, message, 'No invite link is configured!', loadingMsg);}
	const embed = new MessageEmbed()
		.setTitle(`${bot.client.user.username}'s server!`)
		.setURL(process.env.inviteLink)
		.setColor(bot.consts.Colors.INFO);

	loadingMsg.edit({ embeds: [embed] });
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;


const description = 'Get a random insult';
const usage = '';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 15000;
async function run(bot, message, loadingMsg) {
	const insult = await get('https://insult.mattbas.org/api/insult').then(r => r.data);
	// Create the message embed
	const embed = new MessageEmbed()
		.setTitle('An insult:tm:')
		.setColor(bot.consts.Colors.INFO)
		.setDescription(insult);

	loadingMsg.edit({ embeds: [embed] });
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
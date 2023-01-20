import { MessageEmbed } from 'discord.js';


const description = 'Ping pong!';
const usage = '';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 0;
async function run(bot, message, loadingMsg) {
	// Get ping by subtracting the created timestamp from the current timestamp
	const ping = Date.now() - message.createdTimestamp;
	// Set up the title and color depending on the ping value
	let title = 'Pong!';
	let color = 0x000000;
	if (ping < 100) {
		title = '🟢 Super fast!';
		color = 0x00ff00;
	}
	else if (ping < 250) {
		title = '🟡 Pretty fast!';
		color = 0xffff00;
	}
	else if (ping < 500) {
		title = '🟠 Kind of slow..';
		color = 0xff9f00;
	}
	else {
		title = '🔴 Uh oh, slow!';
		color = 0xff0000;
	}
	// Create the message embed
	const embed = new MessageEmbed()
		.setTitle(title)
		.setDescription(`Pong! 🏓\nCurrent latency: **${ping}ms**`)
		.setColor(color)
		.setFooter({
			text: 'Note: the ping is between Discord API and the bot!',
		});

	loadingMsg.edit({ embeds: [embed] });
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../modules/constants.js';

async function dmRelay(bot, message) {
	// Only relay dms from non bots
	if (message.guild) return;
	if (message.author.id === bot.client.id) return;
	if (bot.config.adminIds.indexOf(message.author.id) === -1) {
		// Send any content to the author
		const embed = new MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription(message.content)
			.setFooter({
				text: message.author.id,
			})
			.setColor(0x8b0000);
		if (message.attachments.size > 0) {embed.setImage(message.attachments.first().url);}

		bot.config.adminIds.forEach(async (admin) => {
			const adminUser = await bot.client.users.fetch(admin);
			adminUser
				.send({ embeds: [embed] })
				.catch((err) => bot.logger.warn(err));
		});
	}
	else {
		// Check if there's a message reference (usually reply)
		if (!message.reference) return;
		// Get the replied message and extract id
		const msgRef = await message.channel.messages.fetch(
			message.reference.messageId,
		);
		const userId = msgRef.embeds[0].footer.text;
		const user = await bot.client.users.fetch(userId);

		const embed = new MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription(message.content)
			.setFooter({
				text: message.author.id,
			})
			.setColor(0x8b0000);
		if (message.attachments.size > 0) {embed.setImage(message.attachments.first().url);}

		user.send({ embeds: [embed] }).catch((err) => bot.logger.warn(err));
	}
}

async function channelPassthrough(bot, message) {
	if (message.content.startsWith('doas')) return;

	bot.passthroughs.forEach(async (obj) => {
		if (message.channel.id !== obj.src) return;
		const target = await bot.client.channels.fetch(obj.dest);

		const embed = new MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setColor(Colors.INFO)
			.setDescription(message.content);

		if (message.guild) {
			embed.setFooter({
				text: `${message.guild.name}, #${message.channel.name}`,
				iconURL: message.guild.iconURL(),
			});
		}
		if (message.attachments.size > 0) {embed.setImage(message.attachments.first().url);}

		target
			.send({ embeds: [embed, ...message.embeds] })
			.catch((err) => bot.logger.err(err.toString()));
	});
}

async function channelBridging(bot, message) {
	if (message.content.startsWith('doas')) return;
	bot.bridges.forEach(async (pair) => {
		if (!pair.includes(message.channel.id)) return;
		const targetId = pair[0] === message.channel.id ? pair[1] : pair[0];
		const target = await bot.client.channels.fetch(targetId);

		const embed = new MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setColor(Colors.INFO)
			.setDescription(message.content);

		if (message.guild) {
			embed.setFooter({
				text: `${message.guild.name}, #${message.channel.name}`,
				iconURL: message.guild.iconURL(),
			});
		}
		if (message.attachments.size > 0) {embed.setImage(message.attachments.first().url);}

		target
			.send({ embeds: [embed, ...message.embeds] })
			.catch((err) => bot.logger.err(err.toString()));
	});
}
export { dmRelay, channelBridging, channelPassthrough };
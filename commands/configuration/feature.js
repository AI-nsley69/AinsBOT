import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Disable certain bot features')
	.setUsage('[disable|enable] (feature)')
	.setPermission('MANAGE_GUILD')
	.setGuild(true)
	.setCooldown(10)
	.setRun(async (bot, message, loadingMsg, args) => {
	// Deconstruct array into appropiate vars
	// eslint-disable-next-line prefer-const
		let [action, targetFeature] = args;
		// Check if the action exists and if it is enable or disable
		if (!action) { targetFeature = null; }
		else if (!['enable', 'disable'].includes(action)) {
			return bot.utils.softErr(
				bot,
				message,
				'Incorrect disable/enable argument!',
				loadingMsg,
			);
		}
		// Create a boolean based on the action
		const futureBoolean = action === 'enable';
		// Switch case for editing previews
		switch (targetFeature) {
		// Tiktok preview
		case 'tiktokPreview': {
		// Update the database
			await bot.db.features.update(
				{ tiktokPreview: futureBoolean },
				{
					where: {
						guildId: message.guild.id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, message, 'tiktokPreview', futureBoolean, loadingMsg);
			break;
		}
		// Message preview
		case 'messagePreview': {
		// Update the database
			await bot.db.features.update(
				{ messagePreview: futureBoolean },
				{
					where: {
						guildId: message.guild.id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, message, 'messagePreview', futureBoolean, loadingMsg);
			break;
		}
		// Reddit preview
		case 'redditPreview': {
		// Update the database
			await bot.db.features.update(
				{ redditPreview: futureBoolean },
				{
					where: {
						guildId: message.guild.id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, message, 'redditPreview', futureBoolean, loadingMsg);
			break;
		}

		default: {
			const query = await bot.db.features.findAll({
				where: {
					guildId: message.guild.id,
				},
			});
			const { tiktokPreview, messagePreview, redditPreview } = query[0].dataValues;
			const embed = new MessageEmbed()
				.setTitle('Available feature toggles')
				.addFields([
					{
						name: 'tiktokPreview',
						value: `Allows fetching tiktoks from tiktok links to preview them. Currently set to \`${tiktokPreview}\``,
					},
					{
						name: 'messagePreview',
						value: `Allows previewing messages from message links. Currently set to \`${messagePreview}\``,
					},
					{
						name: 'redditPreview',
						value: `Allows previewing reddit posts from reddit links. Currently set to: \`${redditPreview}\``,
					},
				])
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL(),
				})
				.setColor(bot.consts.Colors.INFO)
				.setTimestamp();

			loadingMsg.edit({ embeds: [embed] });
			break;
		}
		}
	});

// Send embed
async function sendEmbed(bot, message, feature, futureBoolean, loadingMsg) {
	const embed = new MessageEmbed()
		.setTitle(`Updated ${feature}!`)
		.setDescription(`Set to: \`${futureBoolean}\``)
		.setColor(
			!futureBoolean ? bot.consts.Colors.SOFT_ERR : bot.consts.Colors.SUCCESS,
		)
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		})
		.setTimestamp();

	loadingMsg.edit({ embeds: [embed] });
}
import { MessageEmbed } from 'discord.js';
import { Command, OptArg } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Disable certain bot features')
	.setUsage('[disable|enable] (feature)')
	.setArgs({
		action: OptArg.String,
		target: OptArg.String,
	})
	.setPermission('MANAGE_GUILD')
	.setGuild(true)
	.setCooldown(10)
	.setRun(async (bot, ctx) => {
	// Deconstruct array into appropiate vars
		const action = ctx.getArgs().action;
		const targetFeature = ctx.getArgs().target;
		// eslint-disable-next-line prefer-const
		// Check if the action exists and if it is enable or disable
		if (!['enable', 'disable'].includes(action)) {
			return ctx.err(
				'Incorrect disable/enable argument!',
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
						guildId: ctx.getGuild().id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, ctx, 'tiktokPreview', futureBoolean);
			break;
		}
		// Message preview
		case 'messagePreview': {
		// Update the database
			await bot.db.features.update(
				{ messagePreview: futureBoolean },
				{
					where: {
						guildId: ctx.getGuild().id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, ctx, 'messagePreview', futureBoolean);
			break;
		}
		// Reddit preview
		case 'redditPreview': {
		// Update the database
			await bot.db.features.update(
				{ redditPreview: futureBoolean },
				{
					where: {
						guildId: ctx.getGuild().id,
					},
				},
			);
			// Send the embed
			sendEmbed(bot, ctx, 'redditPreview', futureBoolean);
			break;
		}

		default: {
			const query = await bot.db.features.findAll({
				where: {
					guildId: ctx.getGuild().id,
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
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setColor(bot.consts.Colors.INFO)
				.setTimestamp();

			ctx.embed([embed]);
			break;
		}
		}
	});

// Send embed
async function sendEmbed(bot, ctx, feature, futureBoolean) {
	const embed = new MessageEmbed()
		.setTitle(`Updated ${feature}!`)
		.setDescription(`Set to: \`${futureBoolean}\``)
		.setColor(
			!futureBoolean ? bot.consts.Colors.SOFT_ERR : bot.consts.Colors.SUCCESS,
		)
		.setAuthor({
			name: ctx.getAuthor().tag,
			iconURL: ctx.getAuthor().displayAvatarURL(),
		})
		.setTimestamp();

	ctx.embed([embed]);
}
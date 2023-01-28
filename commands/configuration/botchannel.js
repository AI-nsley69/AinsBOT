import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';
import { OptArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Limit the bot to a specific channel!')
	.setUsage('(channel id|channel mention|reset)')
	.setArgs({
		channel: OptArg.Channel,
		reset: OptArg.String,
	})
	.setPermission('MANAGE_GUILD')
	.setGuild(true)
	.setCooldown(10)
	.setRun(async (bot, ctx) => {
		if (!ctx.getArgs().reset && !ctx.getArgs().channel) return ctx.err(ctx, 'Missing a channel or reset argument!');
		const channel = await bot.db.botChannels.findAll({
			where: {
				guildId: ctx.getGuild().id,
			},
		});
		// Check if it's not configured, and if so soft error
		if (!channel[0] && (!ctx.getArgs().reset || ctx.getArgs().channel)) {return ctx.err(ctx, 'Bot channel is not configured in this guild!');}
		// If no command is given, give the current channel
		if (!(ctx.getArgs().reset || ctx.getArgs().channel)) {
		// const configChannel = await message.guild.channels.fetch(channel[0].dataValues.bot_channel);
			const embed = new MessageEmbed()
				.setColor(bot.consts.Colors.INFO)
				.setDescription(`Current config: ${channel[0].dataValues.bot_channel}`);

			ctx.embed({ embeds: [embed] });
			return;
		}

		if (channel[0] && ctx.getArgs().reset) {
			bot.db.botChannels.destroy({
				where: {
					guildId: ctx.getGuild().id,
				},
			});
			const embed = new MessageEmbed()
				.setTitle('Success!')
				.setColor(bot.consts.Colors.SUCCESS)
				.setDescription('Bot channel for this guild has been reset!');

			ctx.embed({ embeds: [embed] });
			return;
		}

		channel[0] ? bot.db.botChannels.update({ bot_channel: ctx.getArgs().channel.id }, { where: { guildId: ctx.getGuild().id } }) : bot.db.botChannels.create({ guildId: ctx.getGuild().id, bot_channel: ctx.getArgs().channel.id });
		const embed = new MessageEmbed()
			.setTitle('Successfully updated the bot channel!')
			.setDescription(`New channel is ${ctx.getArgs().channel}}`)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setColor(bot.consts.Colors.SUCCESS)
			.setTimestamp();

		ctx.embed({ embeds: [embed] });
	});
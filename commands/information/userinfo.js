import { MessageEmbed } from 'discord.js';
import { Command, OptArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Get some information about a user')
	.setUsage('(user)')
	.setArgs({
		user: OptArg.User,
	})
	.setRun(
		async (bot, ctx) => {
			const { user } = ctx.getArgs();
			const member = user ? await ctx.getGuild().members.fetch(user.id) : ctx._src.member;
			// Create a new embed with the info
			const embed = new MessageEmbed()
				.setAuthor({
					name: member.user.tag,
				})
				.setThumbnail(member.user.displayAvatarURL())
				.setColor(member.displayHexColor)
				.setFields([
					{
						name: 'ID',
						value: member.user.id,
					},
					{
						name: 'Account Creation',
						value: member.user.createdAt.toString(),
					},
					{
						name: 'Bot Account',
						value: member.user.bot.toString(),
					},
					{
						name: 'Join date',
						value: member.joinedAt.toString(),
					},
					{
						name: 'Role count',
						value: member.roles.cache.size.toString(),
					},
				])
				.setFooter({
					text: member.user.id,
				})
				.setTimestamp();

			// Send the message
			ctx.embed([embed]);
		});
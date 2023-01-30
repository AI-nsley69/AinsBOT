import { MessageEmbed } from 'discord.js';
import { Command, OptArg } from '../../modules/commandClass.js';
import { Colors } from '../../modules/constants.js';

export default new Command()
	.setDescription('Get info about a marriage')
	.setUsage('(user)')
	.setArgs({
		user: OptArg.User,
	})
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
		const user = ctx.getArgs().user || ctx.getAuthor();

		const status = await bot.db.marriages.findAll({
			where: {
				userId: user.id,
			},
		});

		if (!status[0]) {
			return ctx.err(ctx, 'User is not married!');
		}
		const spouse = await bot.client.users.fetch(status[0].dataValues.spouseId);

		const embed = new MessageEmbed()
			.setTitle(`${user.username}'s marriage! 💍`)
			.setColor(Colors.INFO)
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL(),
			})
			.setThumbnail(spouse.displayAvatarURL({ size: 256 }))
			.addFields([
				{
					name: 'Married to',
					value: spouse.tag,
				},
				{
					name: 'Since',
					value: new Date(status[0].dataValues.date).toDateString(),
				},
			]);

		ctx.embed([embed]);
	});
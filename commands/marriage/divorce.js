import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';
import { Colors } from '../../modules/constants.js';


export default new Command()
	.setDescription('Divorce your spouse')
	.setGuild(true)
	.setCooldown(30)
	.setRun(async (bot, ctx) => {
		const spouse = await getSpouse(bot, ctx.getAuthor().id);
		if (!spouse) {
			return ctx.err(ctx, 'You have no maiden 🙈');
		}

		divorce(bot, ctx.getAuthor().id, spouse.id);

		const embed = new MessageEmbed()
			.setDescription(`${ctx.getAuthor()} has divorced ${spouse}!`)
			.setColor(Colors.INFO)
			.setTimestamp();

		ctx.embed([embed]);
	});

async function getSpouse(bot, id) {
	const status = await bot.db.marriages.findAll({
		where: {
			userId: id,
		},
	});

	if (!status[0]) return null;
	return await bot.client.users.fetch(status[0].dataValues.spouseId);
}

async function divorce(bot, id, spouse) {
	await bot.db.marriages.destroy({
		where: {
			userId: id,
		},
	});

	await bot.db.marriages.destroy({
		where: {
			userId: spouse,
		},
	});
}
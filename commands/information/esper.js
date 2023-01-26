import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
import { Command, ReqArg } from '../../modules/commandClass.js';
const { get } = pkg;

export default new Command()
	.setDescription('Get a dislyte esper!')
	.setUsage('[esper]')
	.setArgs({
		esper: ReqArg.StringCoalescing,
	})
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
		const esper = ctx.getArgs().esper.replace(' ', '-').toLowerCase();
		// Check if we have an argument
		if (!esper) {return ctx.err(ctx, 'Missing an esper!');}
		// Get the esper through the api
		const res = await get(`https://api.initegaming.repl.co/dislyte/esper/${esper}`);
		// Take the data into the esperInfo object
		const esperInfo = res.data;

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${esperInfo.rarity} ${esperInfo.role}`,
				url: esperInfo.attribute.icon,
				iconURL: esperInfo.attribute.icon,
			})
			.setThumbnail(esperInfo.icon)
			.setTitle(esperInfo.name)
			.setURL(esperInfo.url)
			.setColor(esperInfo.attribute.color)
			.setImage(esperInfo.artwork)
			.addFields([
				{
					name: 'Age',
					value: esperInfo.age,
					inline: true,
				},
				{
					name: 'Height',
					value: esperInfo.height,
					inline: true,
				},
				{
					name: 'Preference',
					value: esperInfo.preference,
					inline: true,
				},
				{
					name: 'HP',
					value: esperInfo.stats.hp,
					inline: true,
				},
				{
					name: 'ATK',
					value: esperInfo.stats.atk,
					inline: true,
				},
				{
					name: 'DEF',
					value: esperInfo.stats.def,
					inline: true,
				},
				{
					name: 'Speed',
					value: esperInfo.stats.speed,
					inline: true,
				},
				{
					name: 'Recommend relics',
					value: `__Una:__ ${esperInfo.relics.una}\n__Mui:__ ${esperInfo.relics.mui}`,
				},
				{
					name: 'Recommended Stats',
					value: `__Una 2:__ ${esperInfo.main_stats.una2}\n__Una 4:__ ${esperInfo.main_stats.una4}\n__Mui 2:__ ${esperInfo.main_stats.mui2}`,
				},
				{
					name: 'Credits',
					value: `[Gachax](${esperInfo.credits[0]}) [Fandom](${esperInfo.credits[1]}) [Spreadsheet](${esperInfo.credits[2]})`,
				},
			])
			.setFooter({
				text: `${esperInfo.affiliation}, ${esperInfo.identity}`,
			});

		const skillEmbed = new MessageEmbed()
			.setTitle('Skills')
			.setColor(esperInfo.attribute.color)
			.addFields(esperInfo.skills);

		ctx.embed([embed, skillEmbed]);
	});
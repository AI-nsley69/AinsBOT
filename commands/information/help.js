import { MessageEmbed } from 'discord.js';

import { Command, OptArg } from '../../modules/commandClass.js';
import { csvToArr } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';

export default new Command()
	.setDescription('List all commands in a group with their usage')
	.setUsage('(group)')
	.setArgs({
		group: OptArg.String,
	})
	.setRun(async (bot, ctx) => {
		const group = ctx.getArgs().group;

		if (!group || !Object.values(bot.commandGroups).includes(group)) {
			const embed = new MessageEmbed()
				.setTitle('List of command groups!')
				.setAuthor({
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setDescription(
					Array.from(
						bot.commandGroups,
						(name) => name[0].toUpperCase() + name.substr(1),
					).join('\n'),
				)
				.setColor(Colors.INFO)
				.setFooter({
					text: `Use ${bot.config.prefix}help <group> to learn about commands in the group!`,
				});

			ctx.embed([embed]);
			return;
		}

		const cmds = await fetchCommands(bot, ctx, group);
		const embed = new MessageEmbed()
			.setTitle(`List of commands in the ${group} group!`)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setDescription(cmds)
			.setColor(Colors.INFO)
			.setTimestamp();

		ctx.embed([embed]);
	});

async function fetchCommands(bot, ctx, group) {
	// Query all disabled commands for this guild
	const disabled = ctx.getGuild()
		? await bot.db.commands
			.findAll({
				where: {
					guildId: ctx.getGuild().id,
				},
			})
			.then((q) => csvToArr(q[0].dataValues.disabled))
		: [];

	// Setup an array for all the commands, then append the info as needed and join each command to a string
	const cmds = [...bot.commands.keys()]
		.filter(
			(name) =>
				!disabled.includes(name) && bot.commands.get(name).group === group,
		)
		.map((name) => {
			// eslint-disable-next-line no-shadow
			const { description, usage } = bot.commands.get(name);
			return `${bot.config.prefix}${name} ${usage} - ${description}`;
		});

	return cmds.join('\n');
}
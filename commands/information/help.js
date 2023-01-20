import { MessageEmbed } from 'discord.js';


const description = 'List all commands with their usages';
const usage = '(group)';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 0;
async function run(bot, message, loadingMsg, args) {
	const [group] = args;

	if (!group || !Object.values(bot.commandGroups).includes(group)) {
		const embed = new MessageEmbed()
			.setTitle('List of command groups!')
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription(
				Array.from(
					bot.commandGroups,
					(name) => name[0].toUpperCase() + name.substr(1),
				).join('\n'),
			)
			.setColor(bot.consts.Colors.INFO)
			.setFooter({
				text: `Use ${bot.config.prefix}help <group> to learn about commands in the group!`,
			});

		loadingMsg.edit({ embeds: [embed] });
		return;
	}

	const cmds = await fetchCommands(bot, message, group);
	const embed = new MessageEmbed()
		.setTitle(`List of commands in the ${group} group!`)
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		})
		.setDescription(cmds)
		.setColor(bot.consts.Colors.INFO)
		.setTimestamp();

	loadingMsg.edit({ embeds: [embed] });
}

async function fetchCommands(bot, message, group) {
	// Query all disabled commands for this guild
	const disabled = message.guild
		? await bot.db.commands
			.findAll({
				where: {
					guildId: message.guild.id,
				},
			})
			.then((q) => bot.utils.csvToArr(q[0].dataValues.disabled))
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

export default { description, usage, permission, botPermissions, guild, cooldown, run };

import { MessageEmbed } from 'discord.js';
import { Colors } from '../../modules/constants.js';
import { Command } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('List all admin commands with their usages')
	.setRun(async (bot, ctx) => {
		const cmds = fetchAdminCommands(bot);
		const embed = new MessageEmbed()
			.setTitle('List of admin commands!')
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setDescription(cmds)
			.setColor(Colors.INFO)
			.setTimestamp();

		ctx.embed([embed]);
	});

function fetchAdminCommands(bot) {
	// Same as fetchCommands function
	const cmds = [];
	bot.adminCommands.forEach((cmd, name) => {
		cmds.push(`${bot.config.adminPrefix} ${name} ${cmd.usage} - ${cmd.description}`);
	});
	return cmds.join('\n');
}

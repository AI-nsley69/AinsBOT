import { MessageEmbed } from 'discord.js';

const description = 'List all admin commands with their usages';
const usage = '';
async function run(bot, message) {
	const cmds = fetchAdminCommands(bot, message);
	const embed = new MessageEmbed()
		.setTitle('List of admin commands!')
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		})
		.setDescription(cmds)
		.setColor(bot.consts.Colors.INFO)
		.setTimestamp();

	bot.utils.replyEmbed(bot, message, [embed]);
}

export default { description, usage, run };

function fetchAdminCommands(bot) {
	// Same as fetchCommands function
	const cmds = [];
	bot.adminCommands.forEach((cmd, name) => {
		cmds.push(`${bot.config.adminPrefix} ${name} ${cmd.usage} - ${cmd.description}`);
	});
	return cmds.join('\n');
}

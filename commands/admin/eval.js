import { MessageEmbed } from 'discord.js';
import { replyEmbed } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';

const description = 'evaluate code';
const usage = '[code]';
async function run(bot, message, args) {
	try {
		// evaluate the input, then clean it
		let output = await eval(args.join(' '));
		output = cleanOutput(bot, output.toString());
		// Set up embed
		const embed = new MessageEmbed()
			.setTitle('🖥️ Eval response!')
			.setColor(Colors.SUCCESS)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription('```' + output + '```')
			.setTimestamp();
		// Reply with the embed
		replyEmbed(bot, message, [embed]);
	}
	catch (err) {
		// Error embed
		const embed = new MessageEmbed()
			.setTitle('❌ Eval failed!')
			.setColor(Colors.ERR)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription('```' + err + '```')
			.setTimestamp();

		replyEmbed(bot, message, [embed]);
	}
}

function cleanOutput(bot, output) {
	bot.logger.warn(output);
	return output.replaceAll(process.env.token, '[REDACTED]');
}

export default { description, usage, run };
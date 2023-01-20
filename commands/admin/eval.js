import { MessageEmbed } from 'discord.js';

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
			.setColor(bot.consts.Colors.SUCCESS)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription('```' + output + '```')
			.setTimestamp();
		// Reply with the embed
		bot.utils.replyEmbed(bot, message, [embed]);
	}
	catch (err) {
		// Error embed
		const embed = new MessageEmbed()
			.setTitle('❌ Eval failed!')
			.setColor(bot.consts.Colors.ERR)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription('```' + err + '```')
			.setTimestamp();

		bot.utils.replyEmbed(bot, message, [embed]);
	}
}

function cleanOutput(bot, output) {
	console.log(output);
	return output.replaceAll(process.env.token, '[REDACTED]');
}

export default { description, usage, run };
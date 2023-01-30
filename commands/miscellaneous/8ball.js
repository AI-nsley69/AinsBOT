import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';

// 2d array to include a color with an answer
const response = [
	['Yes', 0x00ff00],
	['Probably', 0xb1ff00],
	['Maybe', 0xffff00],
	['Probably not', 0xff9f00],
	['No', 0xff0000],
];

export default new Command()
	.setDescription('Classic 8ball, ask a question!')
	.setUsage('[question]')
	.setArgs({
		question: ReqArg.StringCoalescing,
	})
	.setRun(async (bot, ctx) => {
		// Join the array to turn it into a string
		const { question } = ctx.getArgs();

		const index = hash(question, ctx.getAuthor().id, response.length);
		const [answer, color] = response[index];
		// Create a new embed with the question, author, color, answer and then add a timestamp
		const embed = new MessageEmbed()
			.setTitle(question)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setColor(color)
			.setDescription(answer)
			.setTimestamp();
		// Send the message
		ctx.embed([embed]);
	});

function hash(str, id, length) {
	str = id + str.toLowerCase();

	let seed = 5381;
	for (let i = 0; i < str.length; i++) {
		seed = seed * 33 ^ str.charCodeAt(i);
	}

	return Math.abs(seed % length);
}
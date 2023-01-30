/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Shipping percentage')
	.setUsage('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setRun(async (bot, ctx) => {
		if (member.user === ctx.getAuthor()) {
			return ctx.err('Hey now! There\'s only one of you.');
		}

		const percentage = generateNumber(ctx.getAuthor().id, ctx.getArgs().user.id);

		const embed = new MessageEmbed()
			.setTitle(getTitle(percentage))
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setFooter({
				text: ctx.getArgs().user.tag,
				iconURL: ctx.getArgs().user.displayAvatarURL(),
			})
			.setDescription(
				`${ctx.getAuthor().tag} and ${ctx.getArgs().user.tag} are ${percentage}% compatible!`,
			)
			.setColor(getColor(percentage));

		ctx.embed([embed]);
	});

// Pseudorng for generating a random digit
function generateNumber(authorId, targetId) {
	// Numbers for rng
	const firstPrime = 5743n;
	const secondPrime = 16807n;
	const thirdPrime = 2147483647n;
	// Convert to BigInt
	authorId = BigInt(authorId);
	targetId = BigInt(targetId);

	// Some algorithm with randomly tested operators to generate a pseudo random number
	let pseudoRand =
    ((authorId ^ targetId) * firstPrime + secondPrime) % thirdPrime;
	// Get the last 2 digits of the number
	pseudoRand = Number(pseudoRand.toString().slice(-2));
	// Divide by 99 and multiply by 100 and then round it off for 0-100 range
	pseduoRand = Math.round((pseudoRand / 99) * 100);
	return pseudoRand;
}

function getTitle(n) {
	const titles = [
		'Archnemesis maybe?', // 0 - 9%
		'Definitely long-time enemies.', // 10 - 19%
		'Y\'all are enemies huh?', // 20 - 29%
		'Acquaintences, nothing else or more.', // 30 - 39%
		'You guys hang in the same friend group.', // 40 - 49%
		'Do you two hang out frequently?', // 50 - 59%
		'Good friends or a fling?', // 60 - 69% (nice)
		'You two definitely crush on each other.', // 70 - 79%
		'Definitely dating.', // 80 - 89%
		'Actual soulmates.', // 90 - 99%
		'Literally made for each other.', // 100%
	];
	n = Math.floor(n / 10);

	return titles[n];
}

function getColor(n) {
	// get the decimal value of the percentage
	n = n / 100;
	// Setup the lowest & highest color
	const lowestColor = {
		red: 0x66,
		green: 0x33,
		blue: 0x99,
	};
	const highestColor = {
		red: 0xff,
		green: 0xd1,
		blue: 0xdc,
	};

	let finalColor = '';
	// Red
	finalColor += Math.round(
		lowestColor.red + n * (highestColor.red - lowestColor.red),
	).toString(16);
	// Green
	finalColor += Math.round(
		lowestColor.green + n * (highestColor.green - lowestColor.green),
	).toString(16);
	// Blue
	finalColor += Math.round(
		lowestColor.blue + n * (highestColor.blue - lowestColor.blue),
	).toString(16);

	return parseInt(finalColor, 16);
}
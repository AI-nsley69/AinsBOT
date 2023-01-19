/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const { MessageEmbed } = require('discord.js');

module.exports = {
	description: 'Shipping percentage',
	usage: '[user]',
	permission: null,
	botPermissions: [],
	guild: true,
	cooldown: 0,
	run: async (bot, message, loadingMsg) => {
		const member = message.mentions.members.first();
		if (!member) {
			return bot.utils.softErr(
				bot,
				message,
				'You did not mention a user!',
				loadingMsg,
			);
		}

		if (member.user === message.author) {
			return bot.utils.softErr(
				bot,
				message,
				'Hey now! There\'s only one of you.',
				loadingMsg,
			);
		}

		const percentage = generateNumber(message.author.id, member.user.id);

		const embed = new MessageEmbed()
			.setTitle(getTitle(percentage))
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setFooter({
				text: member.user.tag,
				iconURL: member.user.displayAvatarURL(),
			})
			.setDescription(
				`${message.author.tag} and ${member.user.tag} are ${percentage}% compatible!`,
			)
			.setColor(getColor(percentage));

		loadingMsg.edit({ embeds: [embed] });
	},
};

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

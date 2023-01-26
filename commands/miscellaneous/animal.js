import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { Command, OptArg } from '../../modules/commandClass.js';


function apiFetch(url, mapper) {
	return (http) => {
		return http.get(url)
			.then(mapper);
	};
}

const animalApis = {
	// Cat apis for image + fact
	cat: {
		fetchImage: apiFetch('https://api.thecatapi.com/v1/images/search', r => r.data[0].url),
		fetchFact: apiFetch('https://some-random-api.ml/facts/cat', r => r.data.fact),
		title: 'Cat payload :D',
	},
	// Capybara api
	capybara: {
		fetchImage: apiFetch('https://api.capybara-api.xyz/v1/image/random', r => r.data.image_urls.original),
		fetchFact: apiFetch('https://api.capybara-api.xyz/v1/facts/random', r => r.data.fact),
		title: 'Capybawa payload <33',
	},
	// Dog api, provides both fact and image
	dog: {
		fetchImage: apiFetch('https://some-random-api.ml/animal/dog', r => r.data.image),
		fetchFact: apiFetch('https://some-random-api.ml/animal/dog', r => r.data.fact),
		title: 'Woof woof!',
	},
	// Fox api, provides both fact and image
	fox: {
		fetchImage: apiFetch('https://some-random-api.ml/animal/fox', r => r.data.image),
		fetchFact: apiFetch('https://some-random-api.ml/animal/fox', r => r.data.fact),
		title: 'Fox fox fox :D',
	},
	// Red panda api, provides both fact and image
	firefox: {
		fetchImage: apiFetch('https://some-random-api.ml/animal/red_panda', r => r.data.image),
		fetchFact: apiFetch('https://some-random-api.ml/animal/red_panda', r => r.data.fact),
		title: 'RED PAAAANDA <333333',
	},
};


export default new Command()
	.setDescription('Get pictures and (possibly) a fact about an animal!')
	.setUsage('(animal)')
	.setArgs({
		api: OptArg.String,
	})
	.setCooldown(15)
	.setRun(async (bot, ctx) => {
		const api = animalApis[ctx.getArgs().api];
		if (!api) {return ctx.err(ctx, '**Available animals**\ncapybara, cat, dog, firefox, fox');}
		// Create the embed
		animalEmbed(bot, ctx, {
			image: await api.fetchImage(axios),
			fact: await api.fetchFact(axios),
			title: api.title,
		});
	});

async function animalEmbed(bot, ctx, animalInfo) {
	const embed = new MessageEmbed()
		.setTitle(animalInfo.title)
		.setAuthor({
			name: ctx.getAuthor().tag,
			iconURL: ctx.getAuthor().displayAvatarURL(),
		})
		.setImage(animalInfo.image)
		.setURL(animalInfo.image)
		.setColor(bot.consts.Colors.SUCCESS);

	animalInfo.fact ? embed.setFooter({ text: animalInfo.fact }) : embed.setTimestamp();
	// Edit to add the new embed
	ctx.embed([embed]);
}
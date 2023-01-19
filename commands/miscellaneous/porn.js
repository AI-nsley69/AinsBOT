const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const params = new URLSearchParams([['sort', 'hot'], ['limit', '30']]);

const supported = ['boobs', 'nsfw', 'milf', 'gonewild', 'camsluts', 'ass', 'holdthemoan', 'hentai', 'creampies', 'realgirls', 'facesitting', 'pronebone', 'rule34', 'adorableporn', 'cumsluts', 'ghostnipples', 'retroussetits', 'fortyfivefiftyfive', 'anal', 'ahegao', 'allthewaythrough', 'biggerthanyouthought', 'bdsm', 'bigdickgirl', 'bigtiddygothgf', 'blowjob', 'breeding', 'bukkake', 'buttplug', 'matingpress', 'choking', 'cock', 'cougars', 'cumflation', 'tittydrop', 'dildo', 'distension', 'doggy', 'ecchi', 'ersties', 'pegging', 'femdom', 'facesitting', 'fisting', 'flubtrash', 'freeuse', 'futanari', 'fishnetsgw', 'gloryholes', 'abandonedporn', 'grool', 'horny', 'hotdogging', 'godpussy', 'kinky', 'lesbians', 'pawg', 'paag', 'lewd', 'plowpose', 'milkingtable', 'theratio', 'thiccerthanyouthought', 'slimstacked', 'thickthighs', 'nanithefuck', 'notadildo'];

// Please end my suffering, why do I do this to myself?
module.exports = {
	description: 'Fetches adult content from whitelisted subreddits',
	usage: '[subreddit]',
	permission: null,
	botPermissions: [],
	guild: true,
	cooldown: 3,
	run: async (bot, message, loadingMsg, args) => {
		// Check if the channel is nsfw
		if (!message.channel.nsfw) return bot.utils.softErr(bot, message, 'This command is only available in NSFW channels! 😡', loadingMsg);
		const [subreddit] = args;
		if (!supported.includes(subreddit)) {
			const embed = new MessageEmbed()
				.setTitle('Available adult content subreddits!')
				.setDescription(supported.join(', '))
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL(),
				})
				.setColor(bot.consts.Colors.INFO);

			loadingMsg.edit({ embeds: [embed] });
			return;
		}
		// Get the payload from the subreddit
		const redditPayload = await axios.get(`https://reddit.com/r/${subreddit}.json`, { params }).then(r => r.data.data.children);
		// Verify the selected post isn't a pinned one
		let rand = Math.floor(Math.random() * redditPayload.length);
		let post = redditPayload[rand];
		while (post.data.pinned) {
			rand += 1;
			post = redditPayload[rand];
		}

		const media = post.data.url.includes('redgifs') ? await axios.get(`https://api.redgifs.com/v1/gfycats/${post.data.url.split('/').slice(-1)[0]}`).then(r => r.data.gfyItem.content_urls.mp4.url) : post.data.url;
		console.log(media);
		// Handle gifv & redgifs differently
		if (media.includes('redgifs') || media.endsWith('.gifv')) {
			if (media.includes('redgifs')) {
				await message.channel.send({ files: [{
					attachment: media,
				}] }).catch(() => message.channel.send(media));
				loadingMsg.delete();
				return;
			}

			await message.channel.send(media);
			loadingMsg.delete();
		}
		const embed = new MessageEmbed()
			.setTitle(`Incoming ${subreddit} content!`)
			.setURL(post.data.url)
			.setColor(bot.consts.Colors.REDDIT)
			.setImage(media)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setFooter({
				text: 'Provided by Reddit!',
			});

		loadingMsg.edit({ embeds: [embed] }).catch(err => bot.logger.err(bot, err.toString()));
	},
};

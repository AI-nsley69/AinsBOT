import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command, ReqArg } from '../../modules/commandClass.js';

const params = new URLSearchParams([['sort', 'hot'], ['limit', '30']]);

const supported = ['boobs', 'nsfw', 'milf', 'gonewild', 'camsluts', 'ass', 'holdthemoan', 'hentai', 'creampies', 'realgirls', 'facesitting', 'pronebone', 'rule34', 'adorableporn', 'cumsluts', 'ghostnipples', 'retroussetits', 'fortyfivefiftyfive', 'anal', 'ahegao', 'allthewaythrough', 'biggerthanyouthought', 'bdsm', 'bigdickgirl', 'bigtiddygothgf', 'blowjob', 'breeding', 'bukkake', 'buttplug', 'matingpress', 'choking', 'cock', 'cougars', 'cumflation', 'tittydrop', 'dildo', 'distension', 'doggy', 'ecchi', 'ersties', 'pegging', 'femdom', 'facesitting', 'fisting', 'flubtrash', 'freeuse', 'futanari', 'fishnetsgw', 'gloryholes', 'abandonedporn', 'grool', 'horny', 'hotdogging', 'godpussy', 'kinky', 'lesbians', 'pawg', 'paag', 'lewd', 'plowpose', 'milkingtable', 'theratio', 'thiccerthanyouthought', 'slimstacked', 'thickthighs', 'nanithefuck', 'notadildo'];


// Please end my suffering, why do I do this to myself?
export default new Command()
	.setDescription('Fetches adult content from whitelisted subreddits')
	.setUsage('[subreddit]')
	.setArgs({
		subreddit: ReqArg.String,
	})
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
	// Check if the channel is nsfw
		if (!ctx.getChannel().nsfw) {return ctx.err(ctx, 'This command is only available in NSFW channels! 😡');}
		const { subreddit } = ctx.getArgs();
		if (!supported.includes(subreddit)) {
			const embed = new MessageEmbed()
				.setTitle('Available adult content subreddits!')
				.setDescription(supported.join(', '))
				.setAuthor({
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setColor(bot.consts.Colors.INFO);

			ctx.embed([embed]);
			return;
		}
		// Get the payload from the subreddit
		const redditPayload = await get(`https://reddit.com/r/${subreddit}.json`, { params }).then(r => r.data.data.children);
		// Verify the selected post isn't a pinned one
		let rand = Math.floor(Math.random() * redditPayload.length);
		let post = redditPayload[rand];
		while (post.data.pinned) {
			rand += 1;
			post = redditPayload[rand];
		}

		const media = post.data.url.includes('redgifs') ? await get(`https://api.redgifs.com/v1/gfycats/${post.data.url.split('/').slice(-1)[0]}`).then(r => r.data.gfyItem.content_urls.mp4.url) : post.data.url;
		console.log(media);
		// Handle gifv & redgifs differently
		if (media.includes('redgifs') || media.endsWith('.gifv')) {
			if (media.includes('redgifs')) {
				await ctx.getChannel().send({
					files: [{
						attachment: media,
					}],
				}).catch(() => ctx.getChannel().send(media));
				return;
			}

			await ctx.getChannel().send(media);
		}
		const embed = new MessageEmbed()
			.setTitle(`Incoming ${subreddit} content!`)
			.setURL(post.data.url)
			.setColor(bot.consts.Colors.REDDIT)
			.setImage(media)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setFooter({
				text: 'Provided by Reddit!',
			});

		ctx.embed([embed]);
	});
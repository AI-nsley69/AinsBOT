import { MessageEmbed } from 'discord.js';
import { getVideoMeta } from 'tiktok-scraper';
import unshortener from 'unshorten.it';
import pkg from 'axios';
const { get } = pkg;
import { shorten } from 'shefin-tinyurl';

// Hardcoded Values
const hardValues = {
	// Hardcoded emotes
	emojis: {
		previewLoading: '<a:AWloading:580639697156702220>',
		previewFail: '<:AWstab:532904244488044584>',
	},
};

// Check if the feature is enabled or not
async function isFeatureEnabled(bot, message, feature) {
	const values = await bot.db.features.findAll({
		where: {
			guildId: message.guild.id,
		},
	});
	return values[0].dataValues[feature];
}

async function getTiktok(bot, message) {
	// Setup regex to get a tiktok url, then check if url has been matched, otherwise return
	const tiktokRegex =
    /^https?:\/\/(?:vm|www)\.tiktok\.com\/(?:t\/)?\w+\/?(?:\?.*)?$/;
	const potentialUrl = message.content.match(tiktokRegex);
	if (!potentialUrl) return;
	// Check if the guild has the command enabled, otherwise return early
	const isEnabled = message.guild
		? await isFeatureEnabled(bot, message, 'tiktokPreview')
		: true;
	if (!isEnabled) return;
	// Get the full url by unshortening it
	const fullUrl = await unshortener(potentialUrl);
	// Send a temporary message and delete the original message
	const msg = await message.channel.send(
		`${hardValues.emojis.previewLoading} Getting tiktok..`,
	);
	if (message.guild) message.delete();
	// Use tiktok-scraper to get the video meta and then grab the videourl
	const req = await getVideoMeta(fullUrl).catch((err) => {
		msg.edit(`${hardValues.emojis.previewFail} Failed to get tiktok!`);
		console.log(err);
		return;
	});
	const { id, text, videoUrl } = req.collector[0];
	// Reply to the message, with the videoUrl, then use the tiktok id for the name and the caption for the description
	try {
		await msg.edit({
			files: [
				{
					attachment: videoUrl,
					name: `${id}.mp4`,
					description: text,
				},
			],
			content: `Requested by ${message.author}:`,
		});
	}
	catch (err) {
		const newLink = await shorten(videoUrl)
			.catch((err) => bot.logger.err(bot, err));
		msg.edit(`Requsted by ${message.author}\n${newLink}`);
	}
}

async function previewMessage(bot, message) {
	const messageLinkRegex =
    /https?:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
	const messageInfo = message.content.match(messageLinkRegex);
	if (!messageInfo) return;
	// Check if the guild has the command enabled, otherwise return early
	if (!(await isFeatureEnabled(bot, message, 'messagePreview'))) return;
	// Create a constant for each information we need, then check if it works
	const [fullUrl, guildId, channelId, messageId] = messageInfo;
	const targetGuild = await bot.client.guilds.fetch(guildId).catch((err) => {
		if (err.httpStatus !== 403) bot.logger.err(bot, err);
	});
	if (!targetGuild) return;
	const targetChannel = await targetGuild.channels
		.fetch(channelId)
		.catch((err) => {
			if (err.httpStatus !== 403) bot.logger.err(bot, err);
		});
	if (!targetChannel) return;
	const targetMessage = await targetChannel.messages.fetch(messageId);
	if (!targetMessage) return;
	const targetMember = !(
		targetMessage.author.bot && targetMessage.author.discriminator === '0000'
	)
		? await targetGuild.members.fetch(targetMessage.author.id)
		: null;
	// Create new embed
	const embed = new MessageEmbed()
		.setTitle(`Message Link Preview! ${targetChannel.nsfw ? '(NSFW)' : ''}`)
		.setURL(fullUrl)
		.setColor(
			targetMember
				? targetMember.displayHexColor
				: message.guild.me.displayHexColor,
		)
		.setFooter({
			text: `In #${targetMessage.channel.name} (${targetGuild.name})`,
			iconURL: targetGuild.iconURL(),
		})
		.setTimestamp(targetMessage.createdTimestamp);
	// Check if there's any message content and include it if so
	if (targetMessage.content) {
		embed.setDescription(
			targetChannel.nsfw
				? `||${targetMessage.content}||`
				: targetMessage.content,
		);
	}
	// Check if there's an image and include it if it isn't an nsfw channel
	if (targetMessage.attachments.size > 0 && !targetChannel.nsfw) {embed.setImage(targetMessage.attachments.first().attachment);}
	// Check if the author is a potential webhook and if not, add an author field
	if (targetMember) {
		embed.setAuthor({
			name: targetMessage.author.tag,
			iconURL: targetMessage.author.displayAvatarURL(),
		});
	}

	bot.utils.replyEmbed(bot, message, [embed]);
}

async function previewReddit(bot, message) {
	// Get reddit link
	const redditLinkRegex = /https?:\/\/(www\.)?reddit\.com\/r\/[^?\s]+/;
	const redditLink = message.content.match(redditLinkRegex);
	// Return if null
	if (!redditLink) return;
	// Check if the guild has the command enabled, otherwise return early
	if (!(await isFeatureEnabled(bot, message, 'redditPreview'))) return;
	// Delete message and send placeholder message
	message.suppressEmbeds(true).catch((err) => console.log(err));
	const msg = await message.channel.send(
		`${hardValues.emojis.previewLoading} Getting reddit post..`,
	);
	// Fetch post
	const redditLinkJson = redditLink[0].slice(0, -1) + '.json';
	let redditPost = await get(redditLinkJson);
	// Get the variables from the post
	redditPost = redditPost.data[0].data.children[0].data;
	const {
		title,
		subreddit_name_prefixed,
		url,
		selftext,
		ups,
		upvote_ratio,
		over_18,
	} = redditPost;

	const embed = new MessageEmbed()
		.setTitle(title)
		.setURL(redditLink[0])
		.setAuthor(subreddit_name_prefixed)
		.setColor(over_18 ? 0xff0000 : 0xffffff)
		.setFooter({
			text: `${ups} upvotes, ${Math.floor(ups / upvote_ratio - ups)} downvotes`,
		});
	if (url) {
		over_18 === message.channel.nsfw
			? embed.setImage(url)
			: embed.setImage(
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.drawception.com%2Fdrawings%2F61767P4Rqp.png&f=1&nofb=1',
			);
	}
	if (selftext) embed.setDescription(selftext);

	msg.edit({
		embeds: [embed],
		content: `Requested by ${message.author}`,
	});
}

export { getTiktok, previewMessage, previewReddit };
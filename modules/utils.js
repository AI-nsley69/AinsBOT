import { MessageEmbed } from 'discord.js';
import { Readable } from 'stream';
import axios from 'axios';
import { Colors, Text } from './constants.js';

async function reply(bot, message, content) {
	message
		.reply(content)
		.catch(() => message.channel.send(content).catch((err) => console.log(err)),
		);
}
async function replyEmbed(bot, message, embeds) {
	message
		.reply({ embeds: embeds })
		.catch(() => message.channel
			.send({ embeds: embeds })
			.catch((err) => bot.logger.err(bot, err)),
		);
}
async function softErr(bot, message, err, loadingMsg = null) {
	const embed = new MessageEmbed()
		.setTitle(Text.SOFT_ERR_TITLE)
		.setColor(Colors.SOFT_ERR)
		.setDescription(err)
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		})
		.setTimestamp();

	loadingMsg
		? loadingMsg.edit({ embeds: [embed] })
		: replyEmbed(bot, message, [embed]);
}
async function handleCmdError(bot, message, loadingMsg, err) {
	// Make the error a string
	err = err.toString();
	// Warn with the error
	bot.logger.warn(bot, err);
	// Soft error with the error
	softErr(bot, message, err, loadingMsg);
}
async function cmdLoadingMsg(bot, message) {
	const embed = new MessageEmbed()
		.setTitle('Command is processing..')
		.setImage('https://c.tenor.com/XasjKGMk_wAAAAAC/load-loading.gif')
		.setFooter({
			text: 'Please be patient!',
		})
		.setColor(Colors.PROMPT)
		.setAuthor({
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		});

	const msg = await message.channel.send({ embeds: [embed] });
	return msg;
}
async function bufToImgurURL(bot, buffer) {
	const imgStream = Readable.from(buffer);
	const res = await bot.imgur
		.upload({
			image: imgStream,
			type: 'stream',
		})
		.catch((err) => bot.logger.err(bot, err));

	return res.data.link;
}
function arrToCsv(arr) {
	return arr.join(',');
}
function csvToArr(csv) {
	return csv.split(',');
}
function putIfAbsent(arr, obj) {
	if (!arr.includes(obj)) {
		arr.push(obj);
	}
}

// Used for interactions command to store gifs in cache incase the api denies it.
async function getMedia(bot, url, cache) {
	const notFound = 'https://media.tenor.com/U5QXJDAXq_AAAAAi/erro.gif';
	try {
		const link = await axios.get(url)
			.then((res) => res.data.link);

		let key = link.split('/');
		key = key[key.length - 1];
		if (!cache.has(key)) cache.set(key, link);

		return link;
	}
	catch (err) {
		bot.logger.warn(bot, err);
		if (cache.size < 1) return notFound;
		const keys = Array.from(cache);
		return cache.get(keys[Math.floor(Math.random() * keys.length)]);
	}
}

export {
	reply, replyEmbed,
	softErr, handleCmdError,
	cmdLoadingMsg, bufToImgurURL,
	arrToCsv, csvToArr,
	putIfAbsent, getMedia,
};

const { MessageEmbed } = require('discord.js');
const { Readable } = require('stream');

module.exports = {
	// Reply to message, fallback to sending if fail
	reply: async (bot, message, content) => {
		message
			.reply(content)
			.catch(() =>
				message.channel.send(content).catch((err) => console.log(err)),
			);
	},
	// Reply with embed to message, fallback to sending if fail
	replyEmbed: async (bot, message, embeds) => {
		message
			.reply({ embeds: embeds })
			.catch(() =>
				message.channel
					.send({ embeds: embeds })
					.catch((err) => bot.logger.err(bot, err)),
			);
	},
	// Send soft error embed i.e incorrect command usage
	softErr: async (bot, message, err, loadingMsg = null) => {
		const embed = new MessageEmbed()
			.setTitle(bot.consts.Text.SOFT_ERR_TITLE)
			.setColor(bot.consts.Colors.SOFT_ERR)
			.setDescription(err)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTimestamp();

		loadingMsg
			? loadingMsg.edit({ embeds: [embed] })
			: bot.utils.replyEmbed(bot, message, [embed]);
	},
	// Handle errors from command
	handleCmdError: async (bot, message, loadingMsg, err) => {
		// Make the error a string
		err = err.toString();
		// Warn with the error
		bot.logger.warn(bot, err);
		// Soft error with the error
		bot.utils.softErr(bot, message, err, loadingMsg);
	},
	// Temporary embed to showcase that the bot is just working on a command
	cmdLoadingMsg: async (bot, message) => {
		const embed = new MessageEmbed()
			.setTitle('Command is processing..')
			.setImage('https://c.tenor.com/XasjKGMk_wAAAAAC/load-loading.gif')
			.setFooter({
				text: 'Please be patient!',
			})
			.setColor(bot.consts.Colors.PROMPT)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			});

		const msg = await message.channel.send({ embeds: [embed] });
		return msg;
	},
	// Convert buffer into imgur url
	bufToImgurURL: async (bot, buffer) => {
		const imgStream = Readable.from(buffer);
		const res = await bot.imgur
			.upload({
				image: imgStream,
				type: 'stream',
			})
			.catch((err) => bot.logger.err(bot, err));

		return res.data.link;
	},
	// next 2 are for sqlite
	// Convert array to csv
	arrToCsv: (arr) => {
		return arr.join(',');
	},
	// Convert csv to array
	csvToArr: (csv) => {
		return csv.split(',');
	},

	putIfAbsent: (arr, obj) => {
		if (!arr.includes(obj)) {
			arr.push(obj);
		}
	},
};

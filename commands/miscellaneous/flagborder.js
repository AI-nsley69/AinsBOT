import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { request } = pkg;
const validFlags = ['lgbt', 'pansexual', 'nonbinary', 'lesbian', 'transgender', 'bisexual'];


const description = 'Create an lgbtq flag around an avatar';
const usage = '[flag] (user)';
const permission = null;
const botPermissions = [];
const guild = false;
const cooldown = 30;
async function run(bot, message, loadingMsg, args) {
	// Verify that we have a flag argument
	const [flag] = args;
	if (!validFlags.includes(flag)) {return bot.utils.softErr(bot, message, `Please choose one of the available flags:\n${validFlags.join(', ')}`, loadingMsg);}
	// Check if there's a mentioned user, else set it to the author
	let member = message.mentions.members.first();
	if (!member) {member = message.member;}
	// Request the image as an array buffer without encoding
	const newAvatar = await request({
		method: 'GET',
		url: `https://some-random-api.ml/canvas/${flag}?avatar=${member.user.displayAvatarURL({ format: 'png', size: 512 })}`,
		responseType: 'arraybuffer',
		responseEncoding: 'null',
	});

	const img = await bot.utils.bufToImgurURL(bot, newAvatar.data);

	const embed = new MessageEmbed()
		.setTitle(`Profile pictured transformed into ${flag}`)
		.setImage(img)
		.setThumbnail(message.author.displayAvatarURL({ size: 256 }))
		.setColor(bot.consts.Colors.SUCCESS)
		.setTimestamp();

	loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, null, err, loadingMsg));
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
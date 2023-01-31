import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { request } = pkg;
import { Command, OptArg, ReqArg } from '../../modules/commandClass.js';
import { bufToImgurURL } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';
const validFlags = ['lgbt', 'pansexual', 'nonbinary', 'lesbian', 'transgender', 'bisexual'];


export default new Command()
	.setDescription('Create an lgbtq flag around an avatar')
	.setUsage('[flag] (user)')
	.setArgs({
		flag: ReqArg.String,
		user: OptArg.User,
	})
	.setCooldown(30)
	.setRun(async (bot, ctx) => {
	// Verify that we have a flag argument
		// eslint-disable-next-line prefer-const
		let { flag, user } = ctx.getArgs();
		if (!validFlags.includes(flag)) {return ctx.err(`Please choose one of the available flags:\n${validFlags.join(', ')}`);}
		// Check if there's a mentioned user, else set it to the author
		if (!user) {user = ctx.getAuthor();}
		// Request the image as an array buffer without encoding
		const newAvatar = await request({
			method: 'GET',
			url: `https://some-random-api.ml/canvas/${flag}?avatar=${user.displayAvatarURL({ format: 'png', size: 512 })}`,
			responseType: 'arraybuffer',
			responseEncoding: 'null',
		});

		const img = await bufToImgurURL(bot, newAvatar.data);

		const embed = new MessageEmbed()
			.setTitle(`Profile pictured transformed into ${flag}`)
			.setImage(img)
			.setThumbnail(ctx.getAuthor().displayAvatarURL({ size: 256 }))
			.setColor(Colors.SUCCESS)
			.setTimestamp();

		ctx.embed([embed]);
	});
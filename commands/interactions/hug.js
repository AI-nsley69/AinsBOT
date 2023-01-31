import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';
import { getMedia } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';

const cache = {
	icon: new Map(),
	gif: new Map(),
};

export default new Command()
	.setDescription('Hug a user!')
	.setUsage('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setCooldown(15)
	.setRun(async (bot, ctx) => {
	// Verify that we have a user to hug and if it is valid
		const member = await ctx.getGuild().members.fetch(ctx.getArgs().user) || null;
		if (!member) {return ctx.err('Awh.. got no one to hug? ):');}
		if (member.user.id === ctx.getAuthor().id) {return ctx.err('You can\'t hug yourself silly!');}
		const media = [];
		// Fetch the media
		media.push(getMedia(bot, 'https://some-random-api.ml/animu/hug', cache.gif));
		media.push(getMedia(bot, 'https://some-random-api.ml/img/red_panda', cache.icon));
		Promise.all(media).then(res => {
			const [ hug, icon ] = res;
			// Embed to send
			const embed = new MessageEmbed()
				.setTitle(`${member.user.tag} received a hug from ${ctx.getAuthor().tag}!`)
				.setThumbnail(icon)
				.setColor(Colors.INFO)
				.setImage(hug)
				.setTimestamp();
			// Edit message to include the new embed
			ctx.embed([embed]);
		});
	});
import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';
import { getMedia } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';

const cache = {
	gif: new Map(),
	icon: new Map(),
};

export default new Command()
	.setDescription('Pat a user!')
	.setUsage('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setCooldown(15)
	.setRun(async (bot, ctx) => {
	// Verify user
		const member = await ctx.getGuild().members.fetch(ctx.getArgs().user) || null;
		if (!member) {return ctx.err(ctx, 'Awh.. got no one to pat? ):');}
		if (member.user.id === ctx.getAuthor().id) {return ctx.err(ctx, 'You can\'t pat yourself silly!');}
		// Fetch from api
		const media = [];
		media.push(getMedia(bot, 'https://some-random-api.ml/animu/pat', cache.gif));
		media.push(getMedia(bot, 'https://some-random-api.ml/img/koala', cache.icon));
		Promise.all(media).then(res => {
			const [ pat, icon ] = res;
			// Create embed
			const embed = new MessageEmbed()
				.setTitle(`${ctx.getAuthor().tag} gave ${member.user.tag} a pat!`)
				.setThumbnail(icon)
				.setColor(Colors.INFO)
				.setImage(pat)
				.setTimestamp();

			ctx.embed([embed]);
		});
	});
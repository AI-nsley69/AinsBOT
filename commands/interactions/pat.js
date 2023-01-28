import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';

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
		const pat = await bot.utils.getMedia(bot, 'https://some-random-api.ml/animu/pat', cache.gif);
		const icon = await bot.utils.getMedia(bot, 'https://some-random-api.ml/img/koala', cache.icon);
		// Create embed
		const embed = new MessageEmbed()
			.setTitle(`${ctx.getAuthor().tag} gave ${member.user.tag} a pat!`)
			.setThumbnail(icon.data.link)
			.setColor(bot.consts.Colors.INFO)
			.setImage(pat.data.link)
			.setTimestamp();

		ctx.embed([embed]);
	});
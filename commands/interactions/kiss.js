import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command, ReqArg } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Kiss a user!')
	.setUsage('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setCooldown(15)
	.setRun(async (bot, ctx) => {
	// Verify that we have a user to hug and if it is valid
		const member = ctx.getGuild().members.fetch(ctx.getArgs().user) || null;
		if (!member) {return ctx.err(ctx, 'Awh.. got no one to kiss? ):');}
		if (member.user.id === ctx.getAuthor().id) {return ctx.err(ctx, 'You can\'t kiss yourself silly!');}
		// Fetch the media
		const kiss = await get('https://api.otakugifs.xyz/gif?reaction=kiss&format=gif');
		// Embed to send
		const embed = new MessageEmbed()
			.setTitle(`${member.user.tag} got kissed by ${ctx.getAuthor().tag}!`)
			.setColor(bot.consts.Colors.INFO)
			.setImage(kiss.data.url)
			.setTimestamp();
		// Edit message to include the new embed
		ctx.embed([embed]);
	});
import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';

const cache = new Map();

export default new Command()
	.setDescription('Cuddle a user!')
	.setUsage('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
		if (ctx.getArgs().user.id === ctx.getAuthor().id) return ctx.err(ctx, 'You can\'t cuddle yourself!');
		// Fetch the media
		const cuddle = await bot.utils.getMedia(bot, 'https://api.otakugifs.xyz/gif?reaction=cuddle&format=gif', cache);
		sendEmbed(bot, ctx, cuddle);
	});

function sendEmbed(bot, ctx, cuddle) {
	// Create a new embed to send
	const embed = new MessageEmbed()
		.setTitle(`${ctx.getArgs().user.tag} got cuddled by ${ctx.getAuthor().tag}!`)
		.setColor(bot.consts.Colors.INFO)
		.setImage(cuddle)
		.setTimestamp();
	// Send the new embed
	ctx.embed([embed]);
}
import { MessageEmbed } from 'discord.js';
import { Command, ReqArg } from '../../modules/commandClass.js';
import { getMedia } from '../../modules/utils.js';
import { Colors } from '../../modules/constants.js';

const cache = new Map();

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
		if (!member) {return ctx.err('Awh.. got no one to kiss? ):');}
		if (member.user.id === ctx.getAuthor().id) {return ctx.err('You can\'t kiss yourself silly!');}
		// Fetch the media
		const kiss = await getMedia(bot, 'https://api.otakugifs.xyz/gif?reaction=kiss&format=gif', cache);
		// Embed to send
		const embed = new MessageEmbed()
			.setTitle(`${member.user.tag} got kissed by ${ctx.getAuthor().tag}!`)
			.setColor(Colors.INFO)
			.setImage(kiss)
			.setTimestamp();
		// Edit message to include the new embed
		ctx.embed([embed]);
	});
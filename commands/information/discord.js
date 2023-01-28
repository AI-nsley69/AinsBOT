import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Get the invite link to the official server!')
	.setRun(async (bot, ctx) => {
		if (!process.env.inviteLink) {return ctx.err(ctx, 'No invite link is configured!');}
		const embed = new MessageEmbed()
			.setTitle(`${bot.client.user.username}'s server!`)
			.setURL(process.env.inviteLink)
			.setColor(bot.consts.Colors.INFO);

		ctx.embed([embed]);
	});
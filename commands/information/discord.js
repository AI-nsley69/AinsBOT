import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';
import { Colors } from '../../modules/constants.js';

export default new Command()
	.setDescription('Get the invite link to the official server!')
	.setRun(async (bot, ctx) => {
		if (!process.env.inviteLink) {return ctx.err('No invite link is configured!');}
		const embed = new MessageEmbed()
			.setTitle(`${bot.client.user.username}'s server!`)
			.setURL(process.env.inviteLink)
			.setColor(Colors.INFO);

		ctx.embed([embed]);
	});
import { MessageEmbed } from 'discord.js';
import pkg from 'axios';
const { get } = pkg;
import { Command } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Get a random insult!')
	.setCooldown(15)
	.setRun(async (bot, ctx) => {
		const insult = await get('https://insult.mattbas.org/api/insult').then(r => r.data);
		// Create the message embed
		const embed = new MessageEmbed()
			.setTitle('An insult:tm:')
			.setColor(bot.consts.Colors.INFO)
			.setDescription(insult);

		ctx.embed([embed]);
	});
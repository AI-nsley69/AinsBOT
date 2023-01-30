import { MessageEmbed } from 'discord.js';
import pkg from 'node-os-utils';
import { Command } from '../../modules/commandClass.js';
const { mem: _mem, cpu: _cpu, os: _os } = pkg;

import pretty from 'pretty-ms';

export default new Command()
	.setDescription('Get information about the bot!')
	.setRun(async (bot, ctx) => {
		const mem = await _mem.info(), cpu = await _cpu.usage(), osName = _os.oos(), osPlatform = _os.platform(), cpuArch = _os.arch(), cpuModel = _cpu.model();
		// , drive = await os.drive.info();
		const embed = new MessageEmbed()
			.setTitle('Bot information!')
			.setColor(ctx.getGuild().me.displayHexColor)
			.addFields([
				{
					name: 'Tag',
					value: `${bot.client.user.tag}`,
				},
				{
					name: 'Operating System',
					value: `${osName} (${osPlatform}) [${cpuArch}]`,
				},
				{
					name: 'Uptime',
					value: pretty((bot.client.uptime)),
				},
				{
					name: 'Memory (RAM)',
					value: `${mem.usedMemMb}/${mem.totalMemMb}mb (${Math.round(100 - mem.freeMemPercentage)}% used)`,
				},
				{
					name: 'CPU Usage',
					value: `${cpu}%`,
				},
				{
					name: 'CPU Model',
					value: cpuModel,
				},
			])
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setTimestamp();

		ctx.embed([embed]);
	});
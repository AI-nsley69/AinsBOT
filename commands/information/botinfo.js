import { MessageEmbed } from 'discord.js';
import pkg from 'node-os-utils';
import { Command } from '../../modules/commandClass.js';
const { mem: _mem, cpu: _cpu, os: _os } = pkg;

export default new Command()
	.setDescription('Get information about the bot!')
	.setRun(async (bot, message, loadingMsg) => {
		const mem = await _mem.info(), cpu = await _cpu.usage(), osName = await _os.oos(), osPlatform = await _os.platform(), cpuArch = _os.arch(), cpuModel = _cpu.model();
		// , drive = await os.drive.info();
		const embed = new MessageEmbed()
			.setTitle('Bot information!')
			.setColor(message.guild.me.displayHexColor)
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
					value: (await import('pretty-ms'))(bot.client.uptime),
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
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTimestamp();

		loadingMsg.edit({ embeds: [embed] });
	});
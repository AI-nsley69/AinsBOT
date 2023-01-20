/* eslint-disable no-undef */
import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Disable/enable commands')
	.setUsage('[disable|enable] [command]')
	.setPermission('MANAGE_GUILD')
	.setGuild(true)
	.setCooldown(10)
	.setRun(async (bot, message, loadingMsg, args) => {
	// Setup variables and verify them
	// eslint-disable-next-line prefer-const
		let [action, targetCmd] = args;
		if (!action) { targetCmd = null; }
		else if (!(action === 'enable' || action === 'disable')) {
			return bot.utils.softErr(
				bot,
				message,
				'Incorrect enable/disable argument',
				loadingMsg,
			);
		}
		else if (!bot.commands.has(targetCmd)) {
			return bot.utils.softErr(
				bot,
				message,
				'Missing target command argument',
				loadingMsg,
			);
		}
		else if (targetCmd === 'command' || targetCmd === 'feature') {
			return bot.utils.softErr(
				bot,
				message,
				'You cannot toggle the command/feature command!',
				loadingMsg,
			);
		}
		// Create boolean based on action
		const futureBool = action === 'enable';
		// Get array of current commands
		let query = await bot.db.commands
			.findAll({
				where: {
					guildId: message.guild.id,
				},
			})
			.then((q) => bot.utils.csvToArr(q[0].dataValues.disabled));
		// Show all commands available if no argument
		if (!targetCmd) {
		// Add all commands to an array
			const allCmds = [];
			for ([cmd, info] of bot.commands.entries()) {
				allCmds.push(cmd);
			}
			// Sort all commands into an enabled or disabled array
			const disabled = allCmds.filter((cmd) => query.includes(cmd));
			const enabled = allCmds.filter((cmd) => !query.includes(cmd));

			const embed = new MessageEmbed()
				.setTitle('Available command toggles!')
				.setColor(bot.consts.Colors.INFO)
				.addFields([
					{
						name: 'Enabled commands',
						value: enabled.join(', '),
					},
					{
						name: 'Disabled commands',
						value: disabled.join(', ') || 'None',
					},
				])
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL(),
				})
				.setTimestamp();

			loadingMsg.edit({ embeds: [embed] });
			return;
		}
		// Soft error if already disabled.
		if (query.includes(targetCmd) && !action) {
			return bot.utils.softErr(
				bot,
				message,
				`This command is already ${action}`,
				loadingMsg,
			);
		}
		// Remove command if enabled, otherwise disable it
		if (futureBool) {query = query.filter((cmd) => cmd !== targetCmd);}
		else {query.push(targetCmd);}

		const csv = bot.utils.arrToCsv(query);
		await bot.db.commands.update(
			{ disabled: csv },
			{
				where: {
					guildId: message.guild.id,
				},
			},
		);

		const embed = new MessageEmbed()
			.setTitle(`Updated ${targetCmd}`)
			.setDescription(`Set to: \`${futureBool}\``)
			.setColor(
				futureBool ? bot.consts.Colors.SUCCESS : bot.consts.Colors.SOFT_ERR,
			)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTimestamp();

		loadingMsg.edit({ embeds: [embed] });
	});
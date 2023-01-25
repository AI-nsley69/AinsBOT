/* eslint-disable no-undef */
import { MessageEmbed } from 'discord.js';
import { Command } from '../../modules/commandClass.js';
import { ReqArg } from '../../modules/commandClass.js';

export default new Command()
	.setDescription('Disable/enable commands')
	.setUsage('[disable|enable] [command]')
	.setArgs({
		action: ReqArg.String,
		command: ReqArg.String,
	})
	.setPermission('MANAGE_GUILD')
	.setGuild(true)
	.setCooldown(10)
	.setRun(async (bot, ctx) => {
	// Setup variables and verify them
	// eslint-disable-next-line prefer-const
		const { action, command } = ctx.getArgs().action;
		if (!(action === 'enable' || action === 'disable')) {
			return ctx.err(ctx, 'Incorrect enable/disable argument');
		}
		else if (!bot.commands.has(command)) {
			return ctx.err(ctx, 'Missing target command');
		}
		else if (command === 'command' || command === 'feature') {
			return ctx.err(ctx, 'You cannot toggle the command/feature command!');
		}
		// Create boolean based on action
		const futureBool = action === 'enable';
		// Get array of current commands
		let query = await bot.db.commands
			.findAll({
				where: {
					guildId: ctx.getGuild().id,
				},
			})
			.then((q) => bot.utils.csvToArr(q[0].dataValues.disabled));
		// Show all commands available if no argument
		if (!command) {
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
					name: ctx.getAuthor().tag,
					iconURL: ctx.getAuthor().displayAvatarURL(),
				})
				.setTimestamp();

			ctx.embed({ embeds: [embed] });
			return;
		}
		// Soft error if already disabled.
		if (query.includes(command) && !action) {
			return ctx.err(ctx, `This command is already ${action}`);
		}
		// Remove command if enabled, otherwise disable it
		if (futureBool) {query = query.filter((cmd) => cmd !== command);}
		else {query.push(command);}

		const csv = bot.utils.arrToCsv(query);
		await bot.db.commands.update(
			{ disabled: csv },
			{
				where: {
					guildId: ctx.getGuild().id,
				},
			},
		);

		const embed = new MessageEmbed()
			.setTitle(`Updated ${command}`)
			.setDescription(`Set to: \`${futureBool}\``)
			.setColor(
				futureBool ? bot.consts.Colors.SUCCESS : bot.consts.Colors.SOFT_ERR,
			)
			.setAuthor({
				name: ctx.getAuthor().tag,
				iconURL: ctx.getAuthor().displayAvatarURL(),
			})
			.setTimestamp();

		ctx.embed({ embeds: [embed] });
	});
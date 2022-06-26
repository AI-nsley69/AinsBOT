const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Disable/enable commands",
    usage: "[disable|enable] [command]",
    permission: "MANAGE_GUILD",
    guild: true,
    run: async (bot, message, args) => {
        // Setup variables and verify them
        let [ action, targetCmd ] = args;
        if (!action) targetCmd = null;
        else if (!(action === "enable" || action === "disable")) return bot.utils.softErr(bot, message, "Incorrect enable/disable argument");
        else if (!bot.commands.has(targetCmd)) return bot.utils.softErr(bot, message, "Missing target command argument");
        else if (targetCmd === "command") return bot.utils.softErr(bot, message, "You cannot disable the command to toggle commands!");
        // Create boolean based on action
        const futureBool = action === "enable" ? true : false;
        // Get array of current commands
        let query = await bot.db.commands.findAll({
            where: {
                guildId: message.guild.id
            }
        }).then(q => bot.utils.csvToArr(q[0].dataValues.disabled));
        // Show all commands available if no argument
        if (!targetCmd) {
            // Add all commands to an array
            let allCmds = [];
            for ([cmd, info] of bot.commands.entries()) {
                allCmds.push(cmd)
            };
            // Sort all commands into an enabled or disabled array
            const disabled = allCmds.filter(cmd => query.includes(cmd));
            const enabled = allCmds.filter(cmd => !query.includes(cmd));
            
            const embed = new MessageEmbed()
            .setTitle("Available command toggles!")
            .setColor(bot.consts.Colors.INFO)
            .addFields([
                {
                    name: "Enabled commands",
                    value: enabled.join(", ")
                },
                {
                    name: "Disabled commands",
                    value: disabled.join(", ") || "None"
                }
            ])
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp();

            bot.utils.replyEmbed(bot, message, [embed]);
            return;
        }
        // Soft error if already disabled.
        if (query.includes(targetCmd) && !action) return bot.utils.softErr(bot, message, `This command is already ${action}`);
        // Remove command if enabled, otherwise disable it
        if (futureBool) query = query.filter(cmd => cmd !== targetCmd);
        else query.push(targetCmd);
        
        const csv = bot.utils.arrToCsv(query);
        await bot.db.commands.update({ disabled: csv }, {
            where: {
                guildId: message.guild.id
            }
        });

        const embed = new MessageEmbed()
        .setTitle(`Updated ${targetCmd}`)
        .setDescription(`Set to: \`${futureBool}\``)
        .setColor(futureBool ? bot.consts.Colors.SUCCESS : bot.consts.Colors.SOFT_ERR)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();

        bot.utils.replyEmbed(bot, message, [embed]);
    }
}

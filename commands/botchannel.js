const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Limit the bot to a specific channel!",
    usage: "(channel id|channel mention|reset)",
    permission: "MANAGE_GUILD",
    guild: true,
    run: async (bot, message, args) => {
        let arg = args[0] === "reset" ? args[0] : (message.mentions.channels.first() || await message.guild.channels.fetch(args[0]));
        if (arg !== "reset") arg = arg.id;
        console.log(arg)
        const channel = await bot.db.botChannels.findAll({
            where: {
                guildId: message.guild.id
            }
        });
        // Check if it's not configured, and if so soft error
        if (!channel[0] && !arg) return bot.utils.softErr(bot, message, "Bot channel is not configured for this guild!");
        // If no command is given, give the current channel
        if (!arg) {
            const configChannel = await message.guild.channels.fetch(channel[0].dataValues.bot_channel)
            const embed = new MessageEmbed()
            .setColor(bot.consts.Colors.INFO)
            .setDescription(`Current config: ${channel[0].dataValues.bot_channel}`);

            bot.utils.replyEmbed(bot, message, [embed]);
            return;
        };

        if (channel[0] && arg === "reset") {
            bot.db.botChannels.destroy({
                where: {
                    guildId: message.guild.id
                }
            });
            const embed = new MessageEmbed()
            .setTitle("Success!")
            .setColor(bot.consts.Colors.SUCCESS)
            .setDescription("Bot channel for this guild has been reset!");

            bot.utils.replyEmbed(bot, message, [embed]);
            return;
        };

        channel[0] ? bot.db.botChannels.update({ bot_channel: arg }, { where: { guildId: message.guild.id } }) : bot.db.botChannels.create({ guildId: message.guild.id, bot_channel: arg });
        const embed = new MessageEmbed()
        .setTitle("Successfully updated the bot channel!")
        .setDescription(`New channel is ${arg}`)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setColor(bot.consts.Colors.SUCCESS)
        .setTimestamp();

        bot.utils.replyEmbed(bot, message, [embed]);
    }
}

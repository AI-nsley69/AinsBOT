module.exports = {
    run: async (bot, guild) => {
        // Add new row for said guild
        // features table
        await bot.db.features.create({
            guildId: guild.id,
            tiktokPreview: true,
            messagePreview: true,
            redditPreview: true
        }).catch(err => logger.verbose(bot, err.toString()));
        // commands table
        await bot.db.commands.create({
            guildId: guild.id,
            disabled: ""
        }).catch(err => logger.verbose(bot, err.toString()));
        // Update activity to reflect new guild count
        bot.client.user.setActivity(`with cats in ${bot.client.guilds.cache.size} guilds!`, {
            type: "PLAYING"
        });
    }
}

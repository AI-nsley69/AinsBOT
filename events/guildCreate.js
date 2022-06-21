module.exports = {
    run: async (bot, guild) => {
        // Add new row for said guild
        await bot.db.features.create({
            guildId: guild.id,
            tiktokPreview: true,
            messagePreview: true,
            redditPreview: true
        });
        // Update activity to reflect new guild count
        bot.client.user.setActivity(`with cats in ${bot.client.guilds.cache.size} guilds!`, {
            type: "PLAYING"
        });
    }
}

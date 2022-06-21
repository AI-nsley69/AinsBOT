module.exports = {
    run: async (bot) => {
        // Sync databases
	bot.db.features.sync();
	checkServersInDB(bot);
	// Set bot activity
        bot.client.user.setActivity(`with cats in ${bot.client.guilds.cache.size} guilds!`, {
            type: "PLAYING"
        });
        // Log the bot information
	const botInfo = {
    	    commands: bot.commands.size,
    	    adminCommands: bot.adminCommands.size,
    	    events: bot.events.size,
    	    user: bot.client.user.tag
	}
	console.table(botInfo);
    }
}
async function checkServersInDB(bot) {
    // Get all guilds and then sort through to only have the ids
    const guildIds = await bot.db.features.findAll();
    const guilds = [];
    guildIds.every(guild => guilds.push(guild.dataValues.guildId));
    // Go through each guild the bot is in and then add every new one if required
    bot.client.guilds.cache.forEach(async (guild) => {
        const id = guild.id;
        if (!guilds.includes(id)) await bot.db.features.create({
            guildId: id,
            tiktokPreview: true,
            messagePreview: true,
            redditPreview: true
        });
    })
}


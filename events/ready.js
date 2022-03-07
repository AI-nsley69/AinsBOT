module.exports = {
    run: async (bot) => {
        bot.client.user.setActivity("with cats", {
            type: "PLAYING"
        });
	const botInfo = {
    	    commands: bot.commands.size,
    	    adminCommands: bot.adminCommands.size,
    	    events: bot.events.size,
    	    user: bot.client.user.tag
	}
	console.table(botInfo)
    }
}

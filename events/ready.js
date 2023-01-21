async function run(bot) {
	// Sync databases
	/*
	bot.db.features.sync();
	bot.db.commands.sync();
	bot.db.botChannels.sync();
	bot.db.marriages.sync();
	*/
	syncTables(bot);

	checkServersInDB(bot);
	// Set bot activity
	bot.client.user.setActivity(
		`with cats in ${bot.client.guilds.cache.size} guilds!`,
		{
			type: 'PLAYING',
		},
	);
	// Log the bot information
	const botInfo = {
		commands: bot.commands.size,
		adminCommands: bot.adminCommands.size,
		events: bot.events.size,
		user: bot.client.user.tag,
	};

	bot.initTime = performance.now() - bot.initTime;

	console.table(botInfo);
	console.log(`Startup took ${Math.round(bot.initTime)}ms`);
}

function syncTables(bot) {
	Object.keys(bot.db).forEach(k => {
		bot.db[k].sync();
	});
}

async function checkServersInDB(bot) {
	// Get all guilds and then sort through to only have the ids
	let guildIds = await bot.db.features.findAll();
	let guilds = [];
	guildIds.every((guild) => guilds.push(guild.dataValues.guildId));
	// Go through each guild the bot is in and then add every new one if required
	bot.client.guilds.cache.forEach(async (guild) => {
		const id = guild.id;
		if (!guilds.includes(id)) {
			await bot.db.features.create({
				guildId: id,
				tiktokPreview: true,
				messagePreview: true,
				redditPreview: true,
			});
		}
	});
	// Do the same for commands
	guildIds = await bot.db.commands.findAll();
	guilds = [];
	guildIds.every((guild) => guilds.push(guild.dataValues.guildId));
	bot.client.guilds.cache.forEach(async (guild) => {
		if (!guilds.includes(guild.id)) {
			await bot.db.commands.create({
				guildId: guild.id,
				disabled: '',
			});
		}
	});
}

export default { run };
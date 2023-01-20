// Hardcoded Values
const hardValues = {
	// Hardcoded emotes
	emojis: {
		sadCat: '<:AWsadcat:819859358187126814>',
		sadPet: '<a:CWsadPet:846784819077578773>',
	},
	// Hardcoded guilds
	guilds: {
		emotionalCatport: ['479713355767087115', '898278965540704333'],
		catEmote: '753906897509154907',
	},
};

async function catEmotes(bot, message) {
	// Check if it's in a guild, doesn't start with any prefix and is the target guild
	if (!message.guild) return;
	if (
		message.content.startsWith(bot.config.prefix) ||
    message.content.startsWith(bot.config.adminPrefix)
	) {return;}
	if (!hardValues.guilds.emotionalCatport.includes(message.guild.id)) return;
	// Constants for emote to check and emote to respond with
	if (message.content.includes(hardValues.emojis.sadCat)) {return message.reply(hardValues.emojis.sadPet);}
	const catAliases =
    /\b(cat|khat|pussy|kat|kitten|kitty|puss|pussies|kittens|katt)\b/;
	if (message.content.match(catAliases)) {
		// Fetch all emotes from a defined cat emote server
		const catEmoteServer = await bot.client.guilds.fetch(
			hardValues.guilds.catEmote,
		);
		// Get a random number for the cat emotes and react with it
		const rand = Math.floor(Math.random() * catEmoteServer.emojis.cache.size);
		message.react(catEmoteServer.emojis.cache.at(rand).id);
	}
}

async function mentionReponse(bot, message) {
	if (
		message.mentions.member ||
    !(message.content === `<@!${bot.client.user.id}>`)
	) {return;}
	const emoticon = Math.floor(Math.random() * 100) === 42 ? '>:(' : ':)';
	const replyString = `My prefix is \`${bot.config.prefix}\` ${emoticon}`;
	message.reply(replyString);
}

export { catEmotes, mentionReponse };
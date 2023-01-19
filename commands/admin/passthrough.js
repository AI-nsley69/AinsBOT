module.exports = {
	description: 'Channel Passthrough',
	usage: '[src] (dest)',
	run: async (bot, message, args) => {
		// Deconstruct args and try to fetch them
		const [source, destination] = args;
		const srcChannel = await bot.client.channels.fetch(source);
		const destChannel = destination ? await bot.client.channels.fetch(destination) : message.channel;
		// Check if channels exist
		if (!srcChannel) return bot.utils.softErr(bot, message, 'Invalid source channel!');
		if (!destChannel) return bot.utils.softErr(bot, message, 'Invalid destination channel!');
		// If the passthrough already exists, remove it
		const arr = bot.passthroughs.filter(obj => obj.src === srcChannel.id);
		if (arr.length !== 0) {
			bot.passthroughs = bot.passthroughs.filter(obj => obj.src !== srcChannel.id);

			message.channel.send('Successfully removed passthrough channel!');
		}
		else {
			bot.passthroughs.push({
				src: srcChannel.id,
				dest: destChannel.id,
			});

			message.channel.send('Successfully added new passthrough channel!');
		}
	},
};

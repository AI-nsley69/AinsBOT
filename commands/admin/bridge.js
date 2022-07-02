module.exports = {
    description: "Channel Bridging",
    usage: "[src] (dest)",
    run: async (bot, message, args) => {
        // Deconstruct args and try to fetch them
        const [source, destination] = args;
        const srcChannel = await bot.client.channels.fetch(source);
        const destChannel = destination ? await bot.client.channels.fetch(destination) : message.channel;
        // Check if channels exist
        if (!srcChannel) return bot.utils.softErr(bot, message, "Invalid source channel!");
        if (!destChannel) return bot.utils.softErr(bot, message, "Invalid destination channel!");
        // If the passthrough already exists, remove it
        const arr = bot.bridges.filter(pair => pair.includes(srcChannel.id));
        if (arr.length !== 0) {
            bot.bridges = bot.bridges.filter(pair => !pair.includes(srcChannel.id));

            message.channel.send("Successfully removed bridge channel!");
        } else {
            bot.bridges.push([
                srcChannel.id,
                destChannel.id
            ]);

            message.channel.send("Successfully added new bridge channel!");
        }
    }
}

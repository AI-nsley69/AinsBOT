module.exports = {
    description: "Kill the bot",
    usage: "",
    run: async (bot, message, args) => {
        console.log(`Bot shutdown by ${message.author.tag}`);
        await message.channel.send("Shutting down..");
        process.exit();
    }
}

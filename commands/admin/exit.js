module.exports = {
    description: "Kill the bot",
    usage: "",
    run: async (bot, message, args) => {
        await message.channel.send("Shutting down..");
        process.exit();
    }
}

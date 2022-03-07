const { Permissions } = require("discord.js");

module.exports = {
    description: "Ping pong!",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        message.reply("Pong!");
    }
}

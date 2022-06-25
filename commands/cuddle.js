const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Cuddle a user!",
    usage: "[user]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Verify that we have a user to hug and if it is valid
        const member = message.mentions.members.first();
        if (!member) return bot.utils.softErr(bot, message, "Awh.. got no one to cuddle? ):");
        if (member.user.id === message.author.id) return bot.utils.softErr(bot, message, "You can't cuddle yourself silly!");
        // Temporary loading message
        const msg = await bot.utils.cmdLoadingMsg(bot, message);
        // Fetch the media
	const cuddle = await axios.get("https://api.otakugifs.xyz/gif?reaction=cuddle&format=gif");
	// Embed to send
        const embed = new MessageEmbed()
        .setTitle(`${member.user.tag} got cuddled by ${message.author.tag}!`)
        .setColor(bot.consts.Colors.INFO)
        .setImage(cuddle.data.url)
        .setTimestamp()
        // Edit message to include the new embed
        msg.edit({ embeds: [embed] });
    }
}

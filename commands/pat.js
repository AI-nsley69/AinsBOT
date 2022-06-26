const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Pat a user!",
    usage: "[user]",
    permission: null,
    guild: true,
    run: async (bot, message, args) => {
        // Verify user
        const member = message.mentions.members.first();
        if (!member) return bot.utils.softErr(bot, message, "Awh.. got no one to pat? ):");
        if (member.user.id === message.author.id) return bot.utils.softErr(bot, message, "You can't pat yourself silly!");
	// Send temporary message
	const msg = await bot.utils.cmdLoadingMsg(bot, message);
	// Fetch from api
	const pat = await axios.get("https://some-random-api.ml/animu/pat");
	const icon = await axios.get("https://some-random-api.ml/img/koala");
	// Create embed
        const embed = new MessageEmbed()
        .setTitle(`${message.author.tag} gave ${member.user.tag} a pat!`)
        .setThumbnail(icon.data.link)
        .setColor(bot.consts.Colors.INFO)
        .setImage(pat.data.link)
        .setTimestamp()

        msg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, msg, err));
    }
}

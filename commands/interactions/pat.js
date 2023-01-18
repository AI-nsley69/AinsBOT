const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Pat a user!",
    usage: "[user]",
    permission: null,
    botPermissions: [],
    guild: true,
    cooldown: 5,
    run: async (bot, message, loadingMsg, args) => {
        // Verify user
        const member = message.mentions.members.first();
        if (!member) return bot.utils.softErr(bot, message, "Awh.. got no one to pat? ):", loadingMsg);
        if (member.user.id === message.author.id) return bot.utils.softErr(bot, message, "You can't pat yourself silly!", loadingMsg);
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

        loadingMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, msg, err, loadingMsg));
    }
}

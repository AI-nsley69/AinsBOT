const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");
const validFlags = ["lgbt", "pansexual", "nonbinary", "lesbian", "transgender", "bisexual"];

module.exports = {
    description: "Create an lgbtq flag around an avatar",
    usage: "[flag] (user)",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Verify that we have a flag argument
        const [flag] = args;
        if (!validFlags.includes(flag)) return bot.utils.softErr(bot, message, `Please choose one of the available flags:\n${validFlags.join(", ")}`);
	// Temporary message that'll get edited later on
        const msg = await bot.utils.cmdLoadingMsg(bot, message);
        // Check if there's a mentioned user, else set it to the author
        let member = message.mentions.members.first();
        if (!member) member = message.member;
        // Request the image as an array buffer without encoding
        const newAvatar = await axios.request({
            method: "GET",
            url: `https://some-random-api.ml/canvas/${flag}?avatar=${member.user.displayAvatarURL({ format: "png", size: 512 })}`,
            responseType: "arraybuffer",
            responseEncoding: "null"
        });

        const img = await bot.utils.bufToImgurURL(bot, newAvatar.data);

        const embed = new MessageEmbed()
        .setTitle(`Profile pictured transformed into ${flag}`)
        .setImage(img)
        .setThumbnail(message.author.displayAvatarURL({ size: 256 }))
        .setColor(bot.consts.Colors.SUCCESS)
        .setTimestamp();

        msg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, msg, err));
    }
}

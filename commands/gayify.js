const { Permissions, MessageEmbed, MessageAttachment } = require("discord.js");
const axios = require("axios")

module.exports = {
    description: "Gayify someone's avatar!",
    usage: "(user)",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Get the user
        let user = message.mentions.members.first();
        if (!user) user = message.member;
        // Temporary message to edit
        const msg = await bot.utils.cmdLoadingMsg(bot, message);
        // Get the avatar and request it
        const userAvatar = user.user.displayAvatarURL({ format: "png" });
        let gayAvatar = `https://some-random-api.ml/canvas/gay/?avatar=${userAvatar}`
        // Turn the return into an attachment and add it to an embed
        msg.edit({ files: [{
            attachment: gayAvatar,
            name: `${user.user.username}.png`
        }] });
    }
}

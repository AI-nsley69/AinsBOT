const { Permissions, MessageEmbed } = require("discord.js");
const ikyy = require("nhentai-ikyy");
const nhentai = new ikyy();

const bannedTags = ["lolicon", "loli-fan", "daughter", "incest", "suicide", "necrophilia", "rape"]

module.exports = {
    description: "Fetches (cartoon) information about adult comics",
    usage: "(number)",
    permission: null,
    guild: true,
    run: async (bot, message, loadingMsg, args) => {
        // Check if channel is nsfw
        if (!message.channel.nsfw) return bot.utils.softErr(bot, message, "This command is only available in NSFW channels! 😡", loadingMsg);
        // Parse the input
        const parsedInput = parseInt(args[0]).toString();
        let comicId = parsedInput;
        // Check if comic exists, otherwise keep on iterating until found
        let comicExists = await nhentai.exists(comicId);
        while (!comicExists) {
            const rand = Math.floor(Math.random() * 999999);
            comicId = rand.toString();
            comicExists = await nhentai.exists(comicId);
        }
        // Get the comic info
        const comicInfo = await nhentai.getDoujin(comicId);
        // Check if the comic includes any banned tags
        let isBanned = false;
        bannedTags.forEach(tag => {
            if (comicInfo.details.tags.includes(tag)) isBanned = true;
        });

        if (isBanned) return bot.utils.softErr(bot, message, "This comic contains one or more banned tags!", loadingMsg);
        // Create new embed
        const embed = new MessageEmbed()
        .setTitle(comicInfo.title)
        .setURL(comicInfo.link)
        .setColor(bot.consts.Colors.SUCCESS)
        .setImage(comicInfo.pages[0])
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .addFields({
            name: "Tags:",
            value: comicInfo.details.tags.join(", ")
        });
        // Edit loading message
        loadingMsg.edit({ embeds: [embed] });
    }
}

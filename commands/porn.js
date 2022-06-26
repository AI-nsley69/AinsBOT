const { Permissions, MessageEmbed } = require("discord.js");
const { RandomPHUB } = require('discord-phub');
const nsfw = new RandomPHUB(unique = true);
const categories = nsfw.categories;

// Please end my suffering, why do I do this to myself?
module.exports = {
    description: "Fetches adult content",
    usage: "[category]",
    permission: null,
    guild: true,
    run: async (bot, message, loadingMsg, args) => {
        // Check if the channel is nsfw
        if (!message.channel.nsfw) return bot.utils.softErr(bot, message, "This command is only available in NSFW channels! 😡", loadingMsg);
        let [category] = args;
        if (!category) {           
            const embed = new MessageEmbed()
            .setTitle("Available adult content categories!")
            .setDescription(nsfw.categories.join(", "))
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setColor(bot.consts.Colors.INFO);

            loadingMsg.edit({ embeds: [embed] });
            return;
       };
       // Remove lolis from this fuckfest
       if (category === "hentai") category = "hentai-no-loli";
       // If the category is not in the list, throw a soft error to the user
       if (!categories.includes(category)) return bot.utils.softErr(bot, message, "Invalid content category!", loadingMsg);
       // Check if media supports gif
       const type = nsfw.verifyTypeInCategory("gif", category) ? Math.random() < 0.3 ? "gif" : "png" : "png";
       // Get the link
       const link = nsfw.getRandomInCategory(category, type).url;
       
       const embed = new MessageEmbed()
       .setTitle(`${category} media!`)
       .setImage(link)
       .setColor(bot.consts.Colors.SUCCESS)
       .setAuthor({
           name: message.author.tag,
           iconURL: message.author.displayAvatarURL()
       });

       loadingMsg.edit({ embeds: [embed] });
    }
}

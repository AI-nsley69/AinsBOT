const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios")

module.exports = {
    description: "Get a random fox",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Create a random title with a random ending
        const titles = ["Floof payload", "squeaky noises", "Incoming fox", "Detected cuteness"];
        const emoticons = [" :)", " :D", " <3", "!"];
        const randTitle = titles[Math.floor(Math.random() * titles.length)] + emoticons[Math.floor(Math.random() * emoticons.length)];
        let footer = await axios.get("https://some-random-api.ml/facts/fox");
        footer = footer.data.fact;
        // Fetch the fox images
        fox = await axios.get("https://randomfox.ca/floof/");
        foxImage = fox.data.image;
        // Create a new embed
        const embed = new MessageEmbed()
        .setTitle(randTitle)
        .setAuthor({
            name: message.author.tag,
            url: foxImage,
            iconURL: message.author.displayAvatarURL()
        })
        .setImage(foxImage)
        .setURL(foxImage)
        .setColor(0xff6961)
        .setFooter({
            text: footer
        })
	// Reply to the author with the embed
	bot.utils.replyEmbed(bot, message, [embed]);
    }
}

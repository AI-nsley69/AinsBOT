const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios")

module.exports = {
    description: "Get a random axolotl",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Create a random title with a random ending
        const titles = ["Axolotl payload", "Blub blub blub", "Incoming axolotl", "Detected cuteness"];
        const emoticons = [" :)", " :D", " <3", "!"];
        const randTitle = titles[Math.floor(Math.random() * titles.length)] + emoticons[Math.floor(Math.random() * emoticons.length)];
        // Fetch the cat images
        axolotl = await axios.get("https://axoltlapi.herokuapp.com/");
        axolotlImage = axolotl.data.url;
        // Create a new embed
        const embed = new MessageEmbed()
        .setTitle(randTitle)
        .setAuthor({
            name: message.author.tag,
            url: axolotlImage,
            iconURL: message.author.displayAvatarURL()
        })
        .setURL(axolotlImage)
        .setImage(axolotlImage)
        .setColor(0xffc0cb)
        .setTimestamp();
	// Reply to the author with the embed
	bot.utils.replyEmbed(bot, message, [embed]);
    }
}

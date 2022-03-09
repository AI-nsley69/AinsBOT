const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios")

module.exports = {
    description: "Get a random dog",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Create a random title with a random ending
        const titles = ["Dog payload", "Woof woof woof", "Incoming puppy", "Detected cuteness"];
        const emoticons = [" :)", " :D", " <3", "!"];
        const randTitle = titles[Math.floor(Math.random() * titles.length)] + emoticons[Math.floor(Math.random() * emoticons.length)];
        // Fetch the dog images
        dog = await axios.get("https://api.thedogapi.com/v1/images/search");
        dogImage = dog.data[0].url;
        // Create a new embed
        const embed = new MessageEmbed()
        .setTitle(randTitle)
        .setAuthor({
            name: message.author.tag,
            url: dogImage,
            iconURL: message.author.displayAvatarURL()
        })
        .setImage(dogImage)
        .setURL(dogImage)
        .setColor(0xff6961)
        .setTimestamp();
	// Reply to the author with the embed
	bot.utils.replyEmbed(bot, message, [embed]);
    }
}

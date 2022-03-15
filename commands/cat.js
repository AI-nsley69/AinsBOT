const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios")

module.exports = {
    description: "Get a random cat",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Create a random title with a random ending
        const titles = ["Cat payload", "Meow meow meow", "Incoming kitty", "Detected cuteness"];
        const emoticons = [" :)", " :D", " <3", "!"];
        const randTitle = titles[Math.floor(Math.random() * titles.length)] + emoticons[Math.floor(Math.random() * emoticons.length)];
        // Get a random cat fact as a footer
        let footer = await axios.get("https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1")
        footer = footer.data.text;
        // Fetch the cat images
        const cat = await axios.get("https://api.thecatapi.com/v1/images/search");
        const catImage = cat.data[0].url;
        // Create a new embed
        const embed = new MessageEmbed()
        .setTitle(randTitle)
        .setAuthor({
            name: message.author.tag,
            url: catImage,
            iconURL: message.author.displayAvatarURL()
        })
        .setImage(catImage)
        .setURL(catImage)
        .setColor(0xff6961)
        .setFooter({
            text: footer
        })
        .setTimestamp();
	// Reply to the author with the embed
	bot.utils.replyEmbed(bot, message, [embed]);
    }
}

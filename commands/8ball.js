const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "8ball command",
    usage: "[question]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Check if the argument array exists, if not let the user know they're missing the question
        if (!args) return message.reply("Missing a question..").then(msg => setTimeout(() => msg.delete(), 5000));
        // Join the array to turn it into a string
        const question = args.join(" ");
        // Check if the message ends with a question mark, otherwise classify it as not asking a question
        if (!question.endsWith("?")) return message.reply("You're not asking a question.").then(msg => setTimeout(() => msg.delete(), 5000));
        // 2d array to include a color with an answer
        const response = [["Yes", 0x00ff00], ["Maybe", 0xffff00], ["No", 0xff0000]]
        const [answer, color] = response[Math.floor(Math.random() * response.length)];
	// Create a new embed with the question, author, color, answer and then add a timestamp
        const embed = new MessageEmbed()
        .setTitle(question)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setColor(color)
        .setDescription(answer)
        .setTimestamp();
	// Send the message
        message.reply({ embeds: [embed] })
    }
}

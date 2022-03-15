const { Permissions, MessageEmbed } = require("discord.js");
const translate = require("translate-google");

module.exports = {
    description: "Translates a message to english",
    usage: "[text, works by replying to a message too]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Check if there's a message reference or any string to translate
        if (!message.reference && !args) return;
        // Get message object if it exists, otherwise make it null
        const msg = message.reference ? (await message.channel.messages.fetch(message.reference.messageId)) : null;
        // Check the referenced msg content if it exists, otherwise just join the arguments to a string
        const toTranslate = msg ? msg.content : args.join(" ");
        // Translate the message
    	const translated = await translate(toTranslate, {to: "en"});
	// Create an embed with the translated message
	const embed = new MessageEmbed()
	.setTitle("Google Translate!")
        .setColor(0x53adcb)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .addFields([
            {
                name: "Original",
                value: toTranslate
            },
            {
                name: "Translated",
                value: translated
            }
        ])
        .setTimestamp();
	// Use the utils to reply with an embed
        bot.utils.replyEmbed(bot, message, [embed]);
    }
}

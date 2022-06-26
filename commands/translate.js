const { Permissions, MessageEmbed } = require("discord.js");
const translate = require("translate-google");

module.exports = {
    description: "Translates a message to english",
    usage: "[text, works by replying to a message too]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Check if there's a message reference or any string to translate
        if (!message.reference && !args) return bot.utils.softErr(bot, message, "Please reply to a message or give text to translate!");
        // Send temporary loading message
        const tmpMsg = await bot.utils.cmdLoadingMsg(bot, message);
        // Get message object if it exists, otherwise make it null
        const msg = message.reference ? (await message.channel.messages.fetch(message.reference.messageId)) : null;
        // Check the referenced msg content if it exists, otherwise just join the arguments to a string
        const toTranslate = msg ? msg.content : args.join(" ");
        // Translate the message
    	const translated = await translate(toTranslate, {to: "en"});
	// Create an embed with the translated message
	const embed = new MessageEmbed()
	.setTitle("Google Translate!")
        .setColor(bot.consts.Colors.TRANSLATE)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .addFields([
            {
                name: "Original",
                value: toTranslate.slice(0, 1023) // We slice to fit the field character limit
            },
            {
                name: "Translated",
                value: translated.slice(0, 1023)
            }
        ])
        .setTimestamp();
        // Edit the temp message
        tmpMsg.edit({ embeds: [embed] }).catch(err => bot.utils.handleCmdError(bot, message, tmpMsg, err));
    }
}

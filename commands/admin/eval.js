const { MessageEmbed } = require("discord.js");

module.exports = {
    description: "evaluate code",
    usage: "[code]",
    run: async (bot, message, args) => {
        try {
            // evaluate the input, then clean it
            let output = await eval(args.join(" "));
            output = cleanOutput(bot, output.toString());
            // Set up embed
            const embed = new MessageEmbed()
            .setTitle("🖥️ Eval response!")
            .setColor(0x00ff00)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription("```" + output + "```")
            .setTimestamp();
            // Reply with the embed
            message.reply({ embeds: [embed] }).catch(() => message.channel.send({ embeds: [embed]}));
        } catch (err) {
            // Error embed
            const embed = new MessageEmbed()
            .setTitle("❌ Eval failed!")
            .setColor(0xff0000)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription("```" + err + "```")
            .setTimestamp();

            message.reply({ embeds: [embed] }).catch(() => message.channel.send({ embeds: [embed]}));
        }
    }
}

function cleanOutput(bot, output) {
    console.log(output)
    return output.replaceAll(process.env.token, "[REDACTED]");
}

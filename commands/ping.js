const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Ping pong!",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Get ping by subtracting the created timestamp from the current timestamp
        const ping = Date.now() - message.createdTimestamp;
        // Get the color by dividing ping by 1000 and multiplying it by 255 and then convert to hex
        const pingDivider = 250; // Modify this as needed, currently ping is usually 10-100ms in my situation
	const color = ping / pingDivider * 255 < 256 ? parseInt(ping / pingDivider * 255, 16) : parseInt(255, 16);
	// Create the message embed
        const embed = new MessageEmbed()
        .setTitle("Pong!")
        .setDescription(`${ping}ms`)
        .setColor(color)
        .setFooter({
            text: "Note: the ping is between Discord API and the bot!"
        });

        message.reply({ embeds: [embed] });
    }
}

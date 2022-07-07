const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Get some information about a user",
    usage: "[mention|user id]",
    permission: null,
    botPermissions: [],
    guild: false,
    run: async (bot, message, loadingMsg, args) => {
        // Fetch the user, either with the first mentioned member or user id, then check if we have a member object
        let member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (!member.user) member = message.member;
	// Create a new embed with the info
        const embed = new MessageEmbed()
        .setAuthor({
            name: member.user.tag,
        })
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(member.displayHexColor)
        .setFields([
            {
                name: "ID",
                value: member.user.id
            },
            {
                name: "Account Creation",
                value: member.user.createdAt.toString()
            },
            {
                name: "Bot Account",
                value: member.user.bot.toString()
            },
            {
                name: "Join date",
                value: member.joinedAt.toString()
            },
            {
                name: "Role count",
                value: member.roles.cache.size.toString()
            }
        ])
        .setFooter({
            text: member.user.id
        })
        .setTimestamp();
	// Send the message
	loadingMsg.edit({ embeds: [embed] });
    }
}

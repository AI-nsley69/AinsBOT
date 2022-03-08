const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Get some information about a user",
    usage: "[mention|user id]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
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
        message.reply({ embeds: [embed] });
    }
}
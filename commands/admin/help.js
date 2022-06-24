const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "List all admin commands with their usages",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        let cmds = fetchAdminCommands(bot, message);
        const embed = new MessageEmbed()
        .setTitle("List of admin commands!")
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setDescription(cmds)
        .setColor(bot.consts.Colors.INFO)
        .setTimestamp();

        bot.utils.replyEmbed(bot, message, [embed]);
    }
}

function fetchAdminCommands(bot, message) {
    // Same as fetchCommands function
    let cmds = [];
    bot.adminCommands.forEach((cmd, name) => {
        cmds.push(`${bot.config.adminPrefix} ${name} ${cmd.usage} - ${cmd.description}`)
    })
    return cmds.join("\n");
}

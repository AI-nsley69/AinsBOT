const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "List all commands with their usages",
    usage: "(admin)",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        let cmds = (args[0] === 'admin' && bot.config.adminIds.includes(message.author.id)) ? fetchAdminCommands(bot, message) : fetchCommands(bot, message);
        const embed = new MessageEmbed()
        .setTitle("List of commands!")
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setDescription(cmds)
        .setTimestamp();

        message.reply({embeds: [embed] })
    }
}

function fetchCommands(bot, message) {
    // Setup an array for all the commands, then append the info as needed and join each command to a string
    let cmds = [];
    bot.commands.forEach((cmd, name) => {
        cmds.push(`${bot.config.prefix}${name} ${cmd.usage} - ${cmd.description}`);
    })
    return cmds.join("\n");
}

function fetchAdminCommands(bot, message) {
    // Same as fetchCommands function
    let cmds = [];
    bot.adminCommands.forEach((cmd, name) => {
        cmds.push(`${bot.config.adminPrefix} ${name} ${cmd.usage} - ${cmd.description}`)
    })
    return cmds.join("\n");
}

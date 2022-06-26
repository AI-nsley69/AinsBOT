const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "List all commands with their usages",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        let cmds = await fetchCommands(bot, message);
        const embed = new MessageEmbed()
        .setTitle("List of commands!")
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

async function fetchCommands(bot, message) {
    // Query all disabled commands for this guild
    const disabled = message.guild ? await bot.db.commands.findAll({
        where: {
            guildId: message.guild.id
        }
    }).then(q => bot.utils.csvToArr(q[0].dataValues.disabled)) : [];
    // Setup an array for all the commands, then append the info as needed and join each command to a string
    let cmds = [];
    bot.commands.forEach((cmd, name) => {
        // Only push enabled commands
        if (!disabled.includes(name)) cmds.push(`${bot.config.prefix}${name} ${cmd.usage} - ${cmd.description}`);
    })
    return cmds.join("\n");
}

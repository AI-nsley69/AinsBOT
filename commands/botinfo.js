const { Permissions, MessageEmbed } = require("discord.js");
const os = require("node-os-utils");

module.exports = {
    description: "Get information about the bot!",
    usage: "",
    permission: null,
    guild: false,
    run: async (bot, message, loadingMsg, args) => {
        const mem = await os.mem.info(), cpu = await os.cpu.usage(), osName = await os.os.oos(), osPlatform = await os.os.platform(), cpuArch = os.os.arch(), cpuModel = os.cpu.model()
        //, drive = await os.drive.info();

        const embed = new MessageEmbed()
        .setTitle("Bot information!")
        .setColor(message.guild.me.displayHexColor)
        .addFields([
            {
                name: "Tag",
                value: `${bot.client.user.tag}`
            },
            {
                name: "Operating System",
                value: `${osName} (${osPlatform}) [${cpuArch}]`
            },
            {
                name: "Uptime",
                value: require("pretty-ms")(bot.client.uptime)
            },
            {
                name: "Memory (RAM)",
                value: `${mem.usedMemMb}/${mem.totalMemMb}mb (${Math.round(100-mem.freeMemPercentage)}% used)`
            },
            {
                name: "CPU Usage",
                value: `${cpu}%`
            },
            {
                name: "CPU Model",
                value: cpuModel
            }
            /*
            {
                name: "Disk Usage",
                value: `${drive.usedGb}/${drive.totalGb}gb (${drive.usedPercentage}% used)`
            }*/
        ])
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp()

        loadingMsg.edit({ embeds: [embed] });
    }
}

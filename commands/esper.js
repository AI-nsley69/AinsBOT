const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Get a dislyte esper!",
    usage: "[esper]",
    permission: null,
    botPermissions: [],    
    guild: false,
    cooldown: 0,
    run: async (bot, message, loadingMsg, args) => {
        const esper = args.join("-").toLowerCase();
        // Check if we have an argument
        if (!esper) return bot.utils.softErr(bot, message, "Missing an esper!", loadingMsg);
        // Get the esper through the api
        const res = await axios.get(`https://api.initegaming.repl.co/dislyte/esper/${esper}`);
        // Take the data into the esperInfo object
        const esperInfo = res.data;

        const embed = new MessageEmbed()
        .setAuthor({
            name: `${esperInfo.rarity} ${esperInfo.role}`,
            url: esperInfo.attribute.icon,
            iconURL: esperInfo.attribute.icon,
        })
        .setThumbnail(esperInfo.icon)
        .setTitle(esperInfo.name)
        .setURL(esperInfo.url)
        .setColor(esperInfo.attribute.color)
        .setImage(esperInfo.artwork)
        .addFields([
            {
                name: "Age",
                value: esperInfo.age,
                inline: true
            },
            {
                name: "Height",
                value: esperInfo.height,
                inline: true
            },
            {
                name: "Preference",
                value: esperInfo.preference,
                inline: true
            },
            {
                name: "HP",
                value: esperInfo.stats.hp,
                inline: true
            },
            {
                name: "ATK",
                value: esperInfo.stats.atk,
                inline: true
            },
            {
                name: "DEF",
                value: esperInfo.stats.def,
                inline: true
            },
            {
                name: "Speed",
                value: esperInfo.stats.speed,
                inline: true
            },
            {
                name: "Recommend relics",
                value: `__Una:__ ${esperInfo.relics.una}\n__Mui:__ ${esperInfo.relics.mui}`,
            },
            {
                name: "Credits",
                value: `[Gachax](${esperInfo.credits[0]}) [Fandom](${esperInfo.credits[1]}) [Spreadsheet](${esperInfo.credits[2]})`
            }
        ])
        .setFooter({
            text: `${esperInfo.affiliation}, ${esperInfo.identity}`
        });

        loadingMsg.edit({ embeds: [embed] });
    }
}

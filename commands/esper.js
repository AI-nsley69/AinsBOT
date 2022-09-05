const { Permissions, MessageEmbed } = require("discord.js");
// MediaWiki API
const wikijs = require('wikijs').default;

var wiki = wikijs({
    apiUrl: "https://dislyte.fandom.com/api.php",
    origin: null
});

const attributes = {
    icons: {
        Shimmer: "https://static.wikia.nocookie.net/dislyte/images/b/b4/Shimmer-icon.png",
        Inferno: "https://static.wikia.nocookie.net/dislyte/images/5/5a/Inferno-icon.png",
        Flow: "https://static.wikia.nocookie.net/dislyte/images/3/33/Flow-icon.png",
        Wind: "https://static.wikia.nocookie.net/dislyte/images/0/06/Wind-icon.png",
    },
    colors: {
        Shimmer: 0xacefed,
        Inferno: 0xfc8c04,
        Flow: 0xdb7bfb,
        Wind: 0x1cf3c3
    }
}

module.exports = {
    description: "Get a dislyte esper!",
    usage: "[esper]",
    permission: null,
    botPermissions: [],    
    guild: false,
    cooldown: 0,
    run: async (bot, message, loadingMsg, args) => {
        const esper = args.join(" ");
        if (!esper) return bot.utils.softErr(bot, message, "Missing an esper!", loadingMsg);
        const search = await wiki.search(esper);
        if (!search) return bot.utils.softErr(bot, message, "Unfortunately, this Esper was not found!", loadingMsg);
        const esperPage = await wiki.page(search.results[0]);

        const pageInfo = await esperPage.fullInfo();
        const raw = await esperPage.rawInfo();
        const attribute = raw.match(/attribute=\{\{Icon\|([a-zA-Z]+)\}/)[1];

        const { age, height, preference, identity } = pageInfo.general;

        const esperInfo = {
            name: search.result[0],
            rarity: raw.match(/rarity=\{\{Icon\|([a-zA-Z]+)\}/)[1],
            role: raw.match(/role=([a-zA-Z]+)/)[1],
            attribute: {
                name: attribute,
                icon: attributes.icons[attribute],
                color: attribute.colors[attribute]
            },
            artwork: await esperPage.mainImage(),
            age: age ? age : "Unknown",
            height: height ? height : "Unknown",
            affiliation: raw.match(/affiliation=\{\{Icon\|([a-z A-Z]+)\}\}/)[1],
            identity: identity ? identity : "Unknown",
            preference: preference ? preference : "Unknown"
        }

        const embed = new MessageEmbed()
        .setAuthor({
            name: `${esperInfo.rarity} ${esperInfo.role}`,
            url: esperInfo.attribute.icon,
            iconURL: esperInfo.attribute.icon,
        })
        .setTitle(esperInfo.name)
        .setURL(esperPage.url)
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
                name: "Affiliation",
                value: esperInfo.affiliation,
                inline: true
            },
            {
                name: "Identity",
                value: esperInfo.identity,
                inline: true
            },
            {
                name: "Preference",
                value: esperInfo.preference,
                inline: true
            },
        ]);
        // .setFooter(`"${pageInfo.general.quote}"`);

        loadingMsg.edit({ embeds: [embed] });
    }
}

const { Permissions, MessageEmbed } = require("discord.js");
// MediaWiki API
const wikijs = require('wikijs').default;

var wiki = wikijs({
    apiUrl: "https://dislyte.fandom.com/api.php",
    origin: null
});

const icons = {
    Shimmer: "https://static.wikia.nocookie.net/dislyte/images/b/b4/Shimmer-icon.png/revision/latest/",
    Inferno: "https://static.wikia.nocookie.net/dislyte/images/5/5a/Inferno-icon.png/revision/latest/",
    Flow: "https://static.wikia.nocookie.net/dislyte/images/3/33/Flow-icon.png/revision/latest/",
    Wind: "https://static.wikia.nocookie.net/dislyte/images/0/06/Wind-icon.png/revision/latest/",
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
        const esperPage = await wiki.page(search.results[0]);
        if (!esperPage) return bot.utils.softErr(bot, message, "Unfortunately, this Esper was not found!", loadingMsg);

        const pageInfo = await esperPage.fullInfo();
        const raw = await esperPage.rawInfo();
        let rarity = raw.match(/rarity=\{\{Icon\|([a-zA-Z]+)\}/)[1];
        let role = raw.match(/role=([a-zA-Z]+)/)[1];
        let attribute = raw.match(/attribute=\{\{Icon\|([a-zA-Z]+)\}/)[1];
        let affiliation = raw.match(/affiliation=\{\{Icon\|([a-z A-Z]+)\}\}/)[1];

        const embed = new MessageEmbed()
        .setAuthor({
            name: `${attribute} ${role}`,
            url: icon[attribute]
        })
        .setTitle(search.results[0])
        .setColor(bot.consts.Colors.INFO)
        .setImage(await esperPage.mainImage())
        .addFields([
            {
                name: "Age",
                value: pageInfo.general.age,
                inline: true
            },
            {
                name: "Height",
                value: pageInfo.general.height,
                inline: true
            },
            {
                name: "Affiliation",
                value: affiliation,
                inline: true
            },
            {
                name: "Identity",
                value: pageInfo.general.identity,
                inline: true
            },
            {
                name: "Preference",
                value: pageInfo.general.preference,
                inline: true
            },
        ]);
        // .setFooter(`"${pageInfo.general.quote}"`);

        loadingMsg.edit({ embeds: [embed] });
    }
}

const { Permissions, MessageEmbed } = require("discord.js");
// MediaWiki API
const wikijs = require('wikijs').default;

var wiki = wikijs({
    apiUrl: "https://dislyte.fandom.com/api.php",
    origin: null
});

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

        const esperPage = await wiki.search(esper).then(async r => await wiki.page(r.results[0]));
        if (!esperPage) return bot.utils.softErr(bot, message, "Unfortunately, this Esper was not found!", loadingMsg);

        const pageInfo = await esperPage.fullInfo();
        let rarity = raw.match(/rarity=\{\{Icon\|([a-zA-Z]+)\}/)[1];
        let role = raw.match(/role=([a-zA-Z]+)/)[1];
        let attribute = raw.match(/attribute=\{\{Icon\|([a-zA-Z]+)\}/)[1];
        let affiliation = raw.match(/affiliation=\{\{Icon\|([a-zA-Z]+ [a-zA-Z]+)\}\}/)[1];

        const embed = new MessageEmbed()
        .setTitle(esper)
        .setColor(bot.constants.COLORS.SUCCESS)
        .setImage(await esperPage.mainImage())
        .addFields([
            {
                name: "Rarity",
                value: rarity,
                inline: true
            },
            {
                name: "Role",
                value: role,
                inline: true
            },
            {
                name: "Attribute",
                value: attribute,
                inline: true
            },
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
        ])
        .setFooter(`"${pageInfo.general.quote}"`);

        loadingMsg.edit({ embeds: [embed] });
    }
}

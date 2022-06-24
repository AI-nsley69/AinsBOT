const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Hug a user!",
    usage: "[user]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("Awh.. got no one to hug? ):");
        if (member.user.id === message.author.id) return message.channel.send("You can't hug yourself silly!");
        
	const hug = await axios.get("https://some-random-api.ml/animu/hug");
	const icon = await axios.get("https://some-random-api.ml/img/red_panda");
        const embed = new MessageEmbed()
        .setTitle(`${member.user.tag} received a hug from ${message.author.tag}!`)
        .setThumbnail(icon.data.link)
        .setColor(bot.consts.Colors.INFO)
        .setImage(hug.data.link)
        .setTimestamp()

        message.channel.send({ embeds: [embed] });
    }
}

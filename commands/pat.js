const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Pat a user!",
    usage: "[user]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("Awh.. got no one to pat? ):");
        if (member.user.id === message.author.id) return message.channel.send("You can't pat yourself silly!");
        
	const hug = await axios.get("https://some-random-api.ml/animu/pat");
	const icon = await axios.get("https://some-random-api.ml/img/koala");
        const embed = new MessageEmbed()
        .setTitle(`${message.author.tag} gave ${member.user.tag} a pat!`)
        .setThumbnail(icon.data.link)
        .setColor(0xccccff)
        .setImage(hug.data.link)
        .setTimestamp()

        message.channel.send({ embeds: [embed] });
    }
}

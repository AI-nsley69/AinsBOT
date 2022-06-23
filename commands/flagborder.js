const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");
const validFlags = ["lgbt", "pansexual", "nonbinary", "lesbian"];

module.exports = {
    description: "Create an lgbtq flag around an avatar",
    usage: "[flag] (user)",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Verify that we have a flag argument
        const [flag] = args;
        if (!validFlags.includes(flag)) return message.channel.send(`Please choose one of the available flags:\n${validFlags.join(", ")}`);
        // Check if there's a mentioned user, else set it to the author
        let member = message.mentions.members.first();
        if (!member) member = message.member;
        // Request the image as an array buffer without encoding
        const newAvatar = await axios.request({
            method: "GET",
            url: `https://some-random-api.ml/canvas/${flag}?avatar=${member.user.displayAvatarURL({ format: "png", size: 512 })}`,
            responseType: "arraybuffer",
            responseEncoding: "null"
        });
        
        message.reply({
            files: [{
                name: `${flag}_border.png`,
                attachment: newAvatar.data
            }],
            content: `Requested by ${message.author}`
        });
    }
}

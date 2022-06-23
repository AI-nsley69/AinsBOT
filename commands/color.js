const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Get color of an image",
    usage: "[color]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Simple validation of color
        const [color] = args;
        if (!color || color.length > 6) return message.channel.send("Incorrect color, please use a 6 digit hexcode number!");
        // Get the color from the api
        const img = await axios.request({
            method: "GET",
            url: `https://some-random-api.ml/canvas/colorviewer?hex=${color}`,
            responseType: "arraybuffer",
            responseEncoding: "null"
        });
        // Send the color
        message.channel.send({
            files: [{
                attachment: img.data,
                name: `${color}.png`
            }]
        }).catch(err => console.log(err));
    }
}

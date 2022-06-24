const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    description: "Get color of an image",
    usage: "[color]",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        // Simple validation of color
        let [color] = args;
        color = await parseColor(bot, message, color);
        if (!color) return message.channel.send("Incorrect color, please use a valid hex code or rgb value!");
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

async function parseColor(bot, message, color) {
    if (!color) return null;
    // Check for prefix
    const prefixes = ["0x", "#"];
    prefixes.forEach(p => {
        if (color.startsWith(p)) color = color.slice(p.length, color.length);
    });
    // Check if rgb
    const match = [...color.matchAll(",")];
    if (match.length === 2) {
        const values = color.split(",");
        if (values.length !== 3) return null;
        color = "";
        values.forEach(v => {
            if (v > 255) color += 255.toString(16);
            else color += Number(v).toString(16);
        })
    }
    // Check if color is too big for a hex number
    if (color.length > 6) return null;
    // Verify that we have the correct characters
    const validChars = /[0-9,a-f]+$/;
    if (!validChars.test(color)) return null;
    // If all checks pass, return the color
    return color;
}


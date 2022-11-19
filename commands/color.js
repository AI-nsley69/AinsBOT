const { Permissions, MessageEmbed } = require("discord.js");
const { createCanvas } = require("canvas");
const axios = require("axios");

module.exports = {
  description: "Get color of an image",
  usage: "[color]",
  permission: null,
  botPermissions: [],
  guild: false,
  cooldown: 5,
  run: async (bot, message, loadingMsg, args) => {
    // Simple validation of color
    let [color] = args;
    color = await parseColor(color);
    if (!color)
      return bot.utils.softErr(
        bot,
        message,
        "Incorrect color, please use a valid hex code or rgb value!",
        loadingMsg
      );
    // Create the image from the hexcode
    const img = createImage(color);

    const imgLink = await bot.utils.bufToImgurURL(bot, img);
    // Send the color
    const embed = new MessageEmbed()
      .setTitle(`0x${color}`)
      .setColor(color)
      .setImage(imgLink)
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    loadingMsg.edit({ embeds: [embed] });
  },
};

async function parseColor(color) {
  if (!color) return null;
  color = color.toLowerCase();
  // Check for prefix
  const prefixes = ["0x", "#"];
  prefixes.forEach((p) => {
    if (color.startsWith(p)) color = color.slice(p.length, color.length);
  });
  // Check if rgb
  const match = [...color.matchAll(",")];
  if (match.length === 2) {
    const values = color.split(",");
    if (values.length !== 3) return null;
    color = "";
    values.forEach((v) => {
      if (v > 255) color += Number(255).toString(16);
      else color += Number(v).toString(16).padStart(2, "0");
    });
  }
  // Check for hex shorthand
  if (color.length === 3) {
    let pad = color.split();
    pad.forEach((v, i) => (pad[i] = v.padStart(2, v)));
    color = pad.join("");
  }
  // Check if color is too big for a hex number
  if (color.length > 6) return null;
  // Verify that we have the correct characters
  const validChars = /^[0-9a-f]+$/;
  if (!validChars.test(color)) return null;
  // If all checks pass, return the color padded to 6 digits
  return color.padStart(6, "0");
}

function createImage(color) {
  // Height & width
  const width = 128;
  const height = 128;
  // Create a new 2d canvas with height and width
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  // Fill the canvas with the color given
  context.fillStyle = `#${color}`;
  context.fillRect(0, 0, width, height);
  // Create a buffer and return it
  const buffer = canvas.toBuffer("image/png");
  return buffer;
}

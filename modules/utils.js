const { MessageEmbed } = require("discord.js");
const { Readable } = require("stream");

module.exports = {
    // Reply to message, fallback to sending if fail
    reply: async (bot, message, content) => {
        message.reply(content).catch(() => message.channel.send(content).catch(err => console.log(err)));
    },
    // Reply with embed to message, fallback to sending if fail
    replyEmbed: async (bot, message, embeds) => {
        message.reply({ embeds: embeds}).catch(() => message.channel.send({ embeds: embeds}).catch(err => console.log(err)));
    },
    // Send soft error embed i.e incorrect command usage
    softErr: async (bot, message, err) => {
        const embed = new MessageEmbed()
        .setTitle(bot.consts.Text.SOFT_ERR_TITLE)
        .setColor(bot.consts.Colors.SOFT_ERR)
        .setDescription(err)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();

        bot.utils.replyEmbed(bot, message, [embed]);
    },
    // Convert buffer into imgur url
    bufToImgurURL: async (bot, buffer) => {
        const imgStream = Readable.from(buffer);
        const res = await bot.imgur.upload({
            image: imgStream,
            type: "stream"
        }).catch(err => console.log(err));

        return res.data.link;
    }
}

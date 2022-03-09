module.exports = {
    replyMsg: async (bot, message, content) => {
        message.reply(content).catch(() => message.channel.send(content).catch(err => console.log(err)));
    },
    replyEmbed: async (bot, message, embeds) => {
        message.reply({ embeds: embeds}).catch(() => message.channel.send({ embeds: embeds}).catch(err => console.log(err)));
    }
}

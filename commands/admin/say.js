module.exports = {
    description: "Repeat all the arguments",
    usage: "[string to repeat]",
    run: async (bot, message, args) => {
        message.delete().catch();
        message.channel.send(args.join(" "));
    }
}

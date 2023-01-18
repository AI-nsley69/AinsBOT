const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  description: "Get info about a marriage",
  usage: "(user)",
  permission: null,
  botPermissions: [],
  guild: true,
  cooldown: 5,
  run: async (bot, message, loadingMsg, args) => {
    // Get the user
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0])) ||
      message.member;
    const user = member.length < 2 ? member.user : message.author;

    const status = await bot.db.marriages.findAll({
      where: {
        userId: user.id,
      },
    });

    if (!status[0])
      return bot.utils.softErr(
        bot,
        message,
        "User is not married!",
        loadingMsg
      );
    const spouse = await bot.client.users.fetch(status[0].dataValues.spouseId);

    const embed = new MessageEmbed()
      .setTitle(`${user.username}'s marriage! 💍`)
      .setColor(bot.consts.Colors.INFO)
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setThumbnail(spouse.displayAvatarURL({ size: 256 }))
      .addFields([
        {
          name: "Married to",
          value: spouse.tag,
        },
        {
          name: "Since",
          value: new Date(status[0].dataValues.date).toDateString(),
        },
      ]);

    loadingMsg.edit({ embeds: [embed] });
  },
};

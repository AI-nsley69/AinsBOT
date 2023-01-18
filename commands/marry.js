const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  description: "Propose to another user!",
  usage: "[user]",
  permission: null,
  botPermissions: [],
  guild: true,
  cooldown: 5,
  run: async (bot, message, loadingMsg, args) => {
    loadingMsg.delete();
    // Get the user
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0])) ||
      message.member;

    const user = member.user;

    if (!(await isAbleToMarry(bot, message, user))) {
      message.channel.send(
        "Sorry, this proposal cannot be accepted!\nThis may because you or them are already married, you're trying to marry yourself or you're trying to marry a bot."
      );
      return;
    }
    // Consent is important
    message.channel.send(
      `${user} do you wish to marry ${message.author}? 🥹 (y/n)`
    );

    try {
      bot.helpers
        .get("message")
        .awaitResponse(message, user.id, 60 * 1000)
        .then((res) => {
          if (res.startsWith("y") && res.length < 4) {
            message.channel.send(
              `I hereby pronounce ${message.author} & ${user} a married couple! 🫶`
            );
            addMarriage(bot, message.author, user);
          } else if (res.startsWith("n") && res.length < 4) {
            message.channel.send("Get rejected bozo L 😈");
          } else {
            message.channel.send(
              "Unrecognized response, marriage cannot be established :c"
            );
          }
        });
    } catch (err) {
      message.channel.send("You just got ghosted! 👻");
    }
  },
};

async function isAbleToMarry(bot, message, user) {
  if (user.bot) return false;
  if (user.id === message.author.id) return false;
  const isAuthorMarried = await bot.db.marriages.findAll({
    where: {
      userId: message.author.id,
    },
  });
  if (isAuthorMarried[0]) return false;
  const isTargetMarried = await bot.db.marriages.findAll({
    where: {
      userId: user.id,
    },
  });
  if (isTargetMarried[0]) return false;
  return true;
}

async function addMarriage(bot, author, user) {
  const time = Date.now();

  await bot.db.marriages.create({
    userId: author.id,
    spouseId: user.id,
    date: time,
  });

  await bot.db.marriages.create({
    userId: user.id,
    spouseId: author.id,
    date: time,
  });
}

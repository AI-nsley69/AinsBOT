const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    description: "Disable certain bot features",
    usage: "[disable|enable] (feature)",
    permission: "MANAGE_GUILD",
    guild: true,
    run: async (bot, message, args) => {
        // Deconstruct array into appropiate vars
        let [ action, targetFeature ] = args;
        // Check if the action exists and if it is enable or disable
        if (!action) targetFeature = null;
        else if (!(action === "enable" || action === "disable")) return message.channel.send("Incorrect disable/enable argument!");
        // Create a boolean based on the action
        const futureBoolean = action === "enable" ? true : false;
        // Switch case for editing previews
        switch (targetFeature) {
            // Tiktok preview
            case "tiktokPreview": {
                // Update the database
                await bot.db.features.update({ tiktokPreview: futureBoolean }, {
                    where: {
                        guildId: message.guild.id
                    }
                });
                // Send the embed
                sendEmbed(bot, message, "tiktokPreview", futureBoolean);
                break;
            }
            // Message preview
            case "messagePreview": {
                // Update the database
                await bot.db.features.update({ messagePreview: futureBoolean }, {
                    where: {
                        guildId: message.guild.id
                    }
                });
                // Send the embed
                sendEmbed(bot, message, "messagePreview", futureBoolean);
                break;
            }
            // Reddit preview
            case "redditPreview": {
                // Update the database
                await bot.db.features.update({ redditPreview: futureBoolean }, {
                    where: {
                        guildId: message.guild.id
                    }
                });
                // Send the embed
                sendEmbed(bot, message, "redditPreview", futureBoolean);
                break;
            }
            
            default: {
                const embed = new MessageEmbed()
                .setTitle("Available feature toggles")
                .addFields([
                    {
                        name: "tiktokPreview",
                        value: "Allows fetching tiktoks from tiktok links to preview them"
                    },
                    {
                        name: "messagePreview",
                        value: "Allows previewing messages from message links"
                    },
                    {
                        name: "redditPreview",
                        value: "Allows previewing reddit posts from reddit links"
                    }
                ])
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp();

                bot.utils.replyEmbed(bot, message, [embed]);
                break;
            }
        }
    }
}

// Send embed
async function sendEmbed(bot, message, feature, futureBoolean) {
    const embed = new MessageEmbed()
    .setTitle(`Updated ${feature}!`)
    .setDescription(`Set to: \`${futureBoolean}\``)
    .setColor(futureBoolean ? 0x00ff00 : 0xff0000)
    .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

    bot.utils.replyEmbed(bot, message, [embed]);
}

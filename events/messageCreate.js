const { MessageEmbed } = require("discord.js");
const tiktok = require("tiktok-scraper");
const unshortener = require("unshorten.it");

module.exports = {
    run: async (bot, message) => {
        // Check if the author is a bot
        if (message.author.bot) return;
        commandHandler(bot, message);
        adminCommandHandler(bot, message);
        catEmotes(bot, message); // Hardcoded to work for my personal guild with my cat emote guild
        mentionReponse(bot, message);
        getTiktok(bot, message);
        previewMessage(bot, message);
    }
}

async function commandHandler(bot, message) {
    // Only react to messages that start with our prefix
    if (message.content.startsWith(bot.config.prefix)) {
        const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
	// Ignore if command doesn't exist, otherwise grab it in a constant
        if (!bot.commands.has(command)) return;
        const commandInfo = bot.commands.get(command);
	// Check if the user has the required permission, if wanted
        if (commandInfo.permission && !message.member.permissions.has(commandInfo.permission)) return;
	// Check if the message is from a guild, if wanted
        if (commandInfo.guild && !message.guild) return;
	// Run the command and catch any error to not crash bot
        commandInfo.run(bot, message, args).catch(err => console.log(err));
    }
}

async function adminCommandHandler(bot, message) {
    // Only react to messages that start with the admin prefix
    if (message.content.startsWith(bot.config.adminPrefix)) {
        // If the author is not in the array of admin ids, return a message letting them know they're not allowed to run this command
        if (!bot.config.adminIds.includes(message.author.id)) return message.channel.send("doas: Operation not permitted");
        // Get the arguments and attempted command
        const args = message.content.slice(bot.config.adminPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        // Check if command exists, if so, get it from the map
        if (!bot.adminCommands.has(command)) return;
        const commandInfo = bot.adminCommands.get(command);
        // Run command
        commandInfo.run(bot, message, args).catch(err => console.log(err));
    }
}

async function catEmotes(bot, message) {
    // Check if it's in a guild, doesn't start with any prefix and is the target guild
    if (!message.guild) return;
    if (message.content.startsWith(bot.config.prefix) || message.content.startsWith(bot.config.adminPrefix)) return;
    let targetGuild = "479713355767087115";
    if (message.guild.id !== targetGuild) return;
    // Constants for emote to check and emote to respond with
    const sadCatEmote = "<:AWsadcat:819859358187126814>";
    const sadPettingEmote = "<a:CWsadPet:846784819077578773>"
    if (message.content.includes(sadCatEmote)) return message.reply(sadPettingEmote);
    catAliases = /\b(cat|khat|pussy|kat|kitten|kitty|puss|pussies|kittens|katt)\b/
    if (message.content.match(catAliases)) {
        // Fetch all emotes from a defined cat emote server
        const emoteServerId = "753906897509154907";
    	const catEmoteServer = await bot.client.guilds.fetch(emoteServerId);
    	// Get a random number for the cat emotes and react with it
    	const rand = Math.floor(Math.random() * catEmoteServer.emojis.cache.size);
    	message.react(catEmoteServer.emojis.cache.at(rand).id)
    }
    
}

async function mentionReponse(bot, message) {
    if (message.mentions.member || !(message.content === `<@!${bot.client.user.id}>`)) return;
    const emoticon = Math.floor(Math.random() * 100) === 42 ? ">:(" : ":)";
    const replyString = `My prefix is \`${bot.config.prefix}\` ${emoticon}`;
    message.reply(replyString);
}

async function getTiktok(bot, message) {
    // Setup regex to get a tiktok url, then check if url has been matched, otherwise return
    let tiktokRegex = /https?:\/\/vm\.tiktok\.com\/\w+/;
    let potentialUrl = message.content.match(tiktokRegex);
    if (!potentialUrl) return;
    // Get the full url by unshortening it
    const fullUrl = await unshortener(potentialUrl);
    // Send a temporary message and delete the original message
    let msg = await message.channel.send("<a:AWloading:580639697156702220> Getting tiktok..");
    message.delete().catch(err => console.log(err));
    // Use tiktok-scraper to get the video meta and then grab the videourl
    const req = await tiktok.getVideoMeta(fullUrl).catch(err => {
        msg.edit("<:AWstab:532904244488044584> Failed to get tiktok!");
        console.log(err);
        return;
    });
    const { id, text, videoUrl } = req.collector[0];
    // Reply to the message, with the videoUrl, then use the tiktok id for the name and the caption for the description
    try {
        msg.edit({
            files: [{
                attachment: videoUrl,
                name: `${id}.mp4`,
                description: text
            }],
            content: `Requested by ${message.author}:`
        });
    } catch (err) {
        msg.edit("Video might be too large! <:AWsadcat:819859358187126814>");
        console.log(err);
    };
}

async function previewMessage(bot, message) {
    let messageLinkRegex = /https?:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    let messageInfo = message.content.match(messageLinkRegex);
    if (!messageInfo) return;
    // Create a constant for each information we need, then check if it works
    const [fullUrl, guildId, channelId, messageId] = messageInfo;
    const targetGuild = await bot.client.guilds.fetch(guildId).catch(err => {
        if (err.httpStatus !== 403) console.log(err);
    });
    if (!targetGuild) return;
    const targetChannel = await targetGuild.channels.fetch(channelId).catch(err => {
        if (err.httpStatus !== 403) console.log(err);
    });
    if (!targetChannel) return;
    const targetMessage = await targetChannel.messages.fetch(messageId);
    if (!targetMessage) return;
    const targetMember = !(targetMessage.author.bot && (targetMessage.author.discriminator === '0000')) ? await targetGuild.members.fetch(targetMessage.author.id) : null;
    // Create new embed
    const embed = new MessageEmbed()
    .setTitle(`Message Link Preview! ${targetChannel.nsfw ? "(NSFW)" : ""}`)
    .setURL(fullUrl)
    .setColor(targetMember ? targetMember.displayHexColor : message.guild.me.displayHexColor)
    .setFooter({
        text: `In #${targetMessage.channel.name} (${targetGuild.name})`,
        iconURL: targetGuild.iconURL()
    })
    .setTimestamp(targetMessage.createdTimestamp);
    // Check if there's any message content and include it if so
    if (targetMessage.content) embed.setDescription(targetChannel.nsfw ? `||${targetMessage.content}||` : targetMessage.content);
    // Check if there's an image and include it if it isn't an nsfw channel
    if (targetMessage.attachments.size > 0 && !targetChannel.nsfw) embed.setImage(targetMessage.attachments.first().attachment);
    // Check if the author is a potential webhook and if not, add an author field
    if (targetMember) embed.setAuthor({
        name: targetMessage.author.tag,
        iconURL: targetMessage.author.displayAvatarURL()
    });
    
    bot.utils.replyEmbed(bot, message, [embed]);
}

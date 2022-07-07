const { MessageEmbed } = require("discord.js");
const tiktok = require("tiktok-scraper");
const unshortener = require("unshorten.it");
const axios = require("axios");
const tinyurl = require("shefin-tinyurl");
const { Op } = require("sequelize");
// Add cooldown for commands
const cmdCooldown = new Set();

// Hardcoded Values
const hardValues = {
    // Hardcoded emotes
    emojis: {
       sadCat: "<:AWsadcat:819859358187126814>",
       sadPet: "<a:CWsadPet:846784819077578773>",
       previewLoading: "<a:AWloading:580639697156702220>",
       previewFail: "<:AWstab:532904244488044584>"
   },
   // Hardcoded guilds
   guilds: {
       emotionalCatport: ["479713355767087115", "898278965540704333"],
       catEmote: "753906897509154907"
   }
}

module.exports = {
    run: async (bot, message) => {
        // Check if the author is a bot
        if (message.author.bot) return;
        // Command handlers
        commandHandler(bot, message);
        adminCommandHandler(bot, message);
        // Dm relay
        dmRelay(bot, message);
        // Misc
        catEmotes(bot, message); // Hardcoded to work for my personal guild with my cat emote guild
        mentionReponse(bot, message);
        // Features
        getTiktok(bot, message);
        previewMessage(bot, message);
        previewReddit(bot, message);
        // Channel bridge & passthrough
        channelPassthrough(bot, message);
        channelBridging(bot, message);
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
        // Check if the command is ran in the bot channel
        const botChannel = await bot.db.botChannels.findAll({ where: { guildId: message.guild ? message.guild.id : null } });
        const correctChannel = botChannel[0] ? botChannel[0].dataValues.bot_channel : null;
        if (correctChannel && correctChannel !== message.channel.id) return;
        // Check if the command is enabled
        const query = await bot.db.commands.findAll({ where: { guildId: message.guild ? message.guild.id : null } });
        const disabledArr = query[0] ? bot.utils.csvToArr(query[0].dataValues.disabled) : [];
        if (disabledArr.includes(command)) return bot.utils.softErr(bot, message, "This command is not enabled in this guild!");
        // Check if user has cooldown on said command
        if (cmdCooldown.has(message.author.id)) return bot.utils.softErr(bot, message, "Slow down there cowboy! You're on cooldown 😅")
	// Check if the user has the required permission, if wanted
        if (commandInfo.permission && !message.member.permissions.has(commandInfo.permission)) return bot.utils.softErr(bot, message, "You do not have the permission to run this command!");
        // Check if bot has the required permissions for the command
        const missingPerms = commandInfo.botPermissions.filter(perm => message.guild ? !message.guild.me.permissions.has(perm) : false);
        if (missingPerms.length > 0) return bot.utils.softErr(bot, message, `I am missing the needed commands to run this command ):\nPlease give me the following permissions:\`${missingPerms.join(", ")}\``);
	// Check if the message is from a guild, if wanted
        if (commandInfo.guild && !message.guild) return bot.utils.softErr(bot, message, "This command is only available in guilds 🌧");
	// Run the command and catch any error to not crash bot
	const loadingMsg = await bot.utils.cmdLoadingMsg(bot, message);
	bot.logger.verbose(bot, `${message.author.tag} ran ${command} command with ${args.length > 0 ? args.join(" ") : "no"} arguments!`)
        await commandInfo.run(bot, message, loadingMsg, args).catch(err => {
            bot.utils.handleCmdError(bot, message, loadingMsg, `${err}`);
            bot.logger.err(bot, err);
        });
        // Add user to cooldown if enabled
        if (commandInfo.cooldown < 0) return;
        cmdCooldown.add(message.author.id);
        setTimeout(() => { cmdCooldown.delete(message.author.id) }, commandInfo.cooldown * 1000); // Cooldown is specified in seconds
    }
}

async function adminCommandHandler(bot, message) {
    // Only react to messages that start with the admin prefix
    if (message.content.startsWith(bot.config.adminPrefix)) {
        // If the author is not in the array of admin ids, return a message letting them know they're not allowed to run this command
        if (!bot.config.adminIds.includes(message.author.id)) {
            bot.utils.softErr(bot, message, "doas: Operation not permitted");
            bot.logger.warn(bot, `${message.author.tag} tried to run an admin command!`);
            return;
        }
        // Get the arguments and attempted command
        const args = message.content.slice(bot.config.adminPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        // Check if command exists, if so, get it from the map
        if (!bot.adminCommands.has(command)) return;
        const commandInfo = bot.adminCommands.get(command);
        // Run command
        commandInfo.run(bot, message, args).catch(err => {
            bot.utils.softErr(bot, message, `${err}`);
            bot.logger.err(bot, err);
        })
    }
}

async function dmRelay(bot, message) {
    // Only relay dms from non bots
    if (message.guild) return;
    if (message.author.id === bot.client.id) return;
    if (bot.config.adminIds.indexOf(message.author.id) === -1) {
        // Send any content to the author
        const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setDescription(message.content)
        .setFooter({
            text: message.author.id
        })
        .setColor(0x8b0000);
        if (message.attachments.size > 0) embed.setImage(message.attachments.first().url);
        
        bot.config.adminIds.forEach(async (admin) => {
            const adminUser = await bot.client.users.fetch(admin);
            adminUser.send({ embeds: [embed] }).catch(err => bot.logger.warn(bot, err));
        })
    } else {
        // Check if there's a message reference (usually reply)
        if (!message.reference) return;
        // Get the replied message and extract id
        const msgRef = await message.channel.messages.fetch(message.reference.messageId);
        const userId = msgRef.embeds[0].footer.text;
        const user = await bot.client.users.fetch(userId);
        
        const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setDescription(message.content)
        .setFooter({
            text: message.author.id
        })
        .setColor(0x8b0000);
        if (message.attachments.size > 0) embed.setImage(message.attachments.first().url);

        user.send({ embeds: [embed] }).catch(err => bot.logger.warn(bot, err)); 
    }
}

async function catEmotes(bot, message) {
    // Check if it's in a guild, doesn't start with any prefix and is the target guild
    if (!message.guild) return;
    if (message.content.startsWith(bot.config.prefix) || message.content.startsWith(bot.config.adminPrefix)) return;
    if (!hardValues.guilds.emotionalCatport.includes(message.guild.id)) return;
    // Constants for emote to check and emote to respond with
    if (message.content.includes(hardValues.emojis.sadCat)) return message.reply(hardValues.emojis.sadPet);
    catAliases = /\b(cat|khat|pussy|kat|kitten|kitty|puss|pussies|kittens|katt)\b/
    if (message.content.match(catAliases)) {
        // Fetch all emotes from a defined cat emote server
    	const catEmoteServer = await bot.client.guilds.fetch(hardValues.guilds.catEmote);
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

// Check if the feature is enabled or not
async function isFeatureEnabled(bot, message, feature) {
    const values = await bot.db.features.findAll({
        where: {
            guildId: message.guild.id,
        }
    });
    return values[0].dataValues[feature];
}

async function getTiktok(bot, message) {
    // Setup regex to get a tiktok url, then check if url has been matched, otherwise return
    let tiktokRegex = /https?:\/\/(?:vm\.tiktok\.com|www\.tiktok\.com\/t)\/\w+(?:\/?\?k=1)?$/;
    let potentialUrl = message.content.match(tiktokRegex);
    if (!potentialUrl) return;
    // Check if the guild has the command enabled, otherwise return early
    if (!(await isFeatureEnabled(bot, message, "tiktokPreview"))) return;
    // Get the full url by unshortening it
    const fullUrl = await unshortener(potentialUrl);
    // Send a temporary message and delete the original message
    let msg = await message.channel.send(`${hardValues.emojis.previewLoading} Getting tiktok..`);
    message.delete().catch(err => console.log(err));
    // Use tiktok-scraper to get the video meta and then grab the videourl
    const req = await tiktok.getVideoMeta(fullUrl).catch(err => {
        msg.edit(`${hardValues.emojis.previewFail} Failed to get tiktok!`);
        console.log(err);
        return;
    });
    const { id, text, videoUrl } = req.collector[0];
    // Reply to the message, with the videoUrl, then use the tiktok id for the name and the caption for the description
    try {
        await msg.edit({
            files: [{
                attachment: videoUrl,
                name: `${id}.mp4`,
                description: text
            }],
            content: `Requested by ${message.author}:`
        });
    } catch (err) {
        const newLink = await tinyurl.shorten(videoUrl).catch(err => bot.logger.err(bot, err));
        msg.edit(`Requsted by ${message.author}\n${newLink}`);
    };
}

async function previewMessage(bot, message) {
    let messageLinkRegex = /https?:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    let messageInfo = message.content.match(messageLinkRegex);
    if (!messageInfo) return;
    // Check if the guild has the command enabled, otherwise return early
    if (!(await isFeatureEnabled(bot, message, "messagePreview"))) return;
    // Create a constant for each information we need, then check if it works
    const [fullUrl, guildId, channelId, messageId] = messageInfo;
    const targetGuild = await bot.client.guilds.fetch(guildId).catch(err => {
        if (err.httpStatus !== 403) bot.logger.err(bot, err);
    });
    if (!targetGuild) return;
    const targetChannel = await targetGuild.channels.fetch(channelId).catch(err => {
        if (err.httpStatus !== 403) bot.logger.err(bot, err);
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

async function previewReddit(bot, message) {
    // Get reddit link
    let redditLinkRegex = /https?:\/\/(www\.)?reddit\.com\/r\/[^?\s]+/;
    let redditLink = message.content.match(redditLinkRegex);
    // Return if null
    if (!redditLink) return;
    // Check if the guild has the command enabled, otherwise return early
    if (!(await isFeatureEnabled(bot, message, "redditPreview"))) return;
    // Delete message and send placeholder message 
    message.suppressEmbeds(true).catch(err => console.log(err));
    let msg = await message.channel.send(`${hardValues.emojis.previewLoading} Getting reddit post..`);
    // Fetch post
    let redditLinkJson = redditLink[0].slice(0, -1) + ".json";
    let redditPost = await axios.get(redditLinkJson);
    // Get the variables from the post
    redditPost = redditPost.data[0].data.children[0].data;
    const { title, subreddit_name_prefixed, url, selftext, ups, upvote_ratio, over_18 } = redditPost;

    const embed = new MessageEmbed()
    .setTitle(title)
    .setURL(redditLink[0])
    .setAuthor(subreddit_name_prefixed)
    .setColor(over_18 ? 0xff0000 : 0xffffff)
    .setFooter(`${ups} upvotes, ${Math.floor(ups / upvote_ratio - ups)} downvotes`);
    if (url) over_18 === message.channel.nsfw ? embed.setImage(url) : embed.setImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.drawception.com%2Fdrawings%2F61767P4Rqp.png&f=1&nofb=1");
    if (selftext) embed.setDescription(selftext);

    msg.edit({
        embeds: [embed],
        content: `Requested by ${message.author}`
    });
}

async function channelPassthrough(bot, message) {
    if (message.content.startsWith("doas")) return;

    bot.passthroughs.forEach(async (obj) => {
        if (message.channel.id !== obj.src) return;
        const target = await bot.client.channels.fetch(obj.dest);

        const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setColor(bot.consts.Colors.INFO)
        .setDescription(message.content)

        if (message.guild) embed.setFooter({
            text: `${message.guild.name}, #${message.channel.name}`,
            iconURL: message.guild.iconURL()
        });
        if (message.attachments.size > 0) embed.setImage(message.attachments.first().url);

        target.send({ embeds: [embed, ...message.embeds] }).catch(err => bot.logger.err(bot, err.toString()));
    })
}

async function channelBridging(bot, message) {
    if (message.content.startsWith("doas")) return;
    bot.bridges.forEach(async (pair) => {
        if (!pair.includes(message.channel.id)) return;
        const targetId = pair[0] === message.channel.id ? pair[1] : pair[0];
        const target = await bot.client.channels.fetch(targetId);
        
        const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setColor(bot.consts.Colors.INFO)
        .setDescription(message.content)

        if (message.guild ) embed.setFooter({
            text: `${message.guild.name}, #${message.channel.name}`,
            iconURL: message.guild.iconURL()
        });
        if (message.attachments.size > 0) embed.setImage(message.attachments.first().url);

        target.send({ embeds: [embed, ...message.embeds] }).catch(err => bot.logger.err(bot, err.toString()));
    })
}

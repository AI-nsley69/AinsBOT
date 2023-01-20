import { commandHandler, adminCommandHandler } from './messageCreate/handlers.js';
import { catEmotes } from './messageCreate/misc.js';
import { getTiktok, previewMessage, previewReddit } from './messageCreate/features.js';
import { dmRelay, channelBridging, channelPassthrough } from './messageCreate/bridges.js';


async function run(bot, message) {
	// Check if the author is a bot
	if (message.author.bot) {return;}
	// Command handlers
	commandHandler(bot, message).catch(err => bot.logger.err(err.toString()));
	adminCommandHandler(bot, message).catch(err => bot.logger.err(err.toString()));
	// Dm relay
	dmRelay(bot, message).catch(err => bot.logger.err(err.toString()));
	// Misc
	// Hardcoded to work for my personal guild with my cat emote guild
	catEmotes(bot, message).catch(err => bot.logger.err(err.toString()));
	// mentionReponse(bot, message);
	// Features
	getTiktok(bot, message).catch(err => bot.logger.err(err.toString()));
	previewMessage(bot, message).catch(err => bot.logger.err(err.toString()));
	previewReddit(bot, message).catch(err => bot.logger.err(err.toString()));
	// Channel bridge & passthrough
	channelPassthrough(bot, message).catch(err => bot.logger.err(err.toString()));
	channelBridging(bot, message).catch(err => bot.logger.err(err.toString()));
}

export default { run };
import { commandHandler, adminCommandHandler } from './messageCreate/handlers.js';
import { catEmotes } from './messageCreate/misc.js';
import { previewMessage, previewReddit } from './messageCreate/features.js';
import { dmRelay, channelBridging, channelPassthrough } from './messageCreate/bridges.js';

async function run(bot, message) {
	if (message.author.bot) {return;}
	const logError = err => bot.logger.err(err);
	// Command handlers
	commandHandler(bot, message).catch(logError);
	adminCommandHandler(bot, message).catch(logError);
	// Dm relay
	dmRelay(bot, message).catch(logError);
	// Misc
	// Hardcoded to work for my personal guild with my cat emote guild
	catEmotes(bot, message).catch(logError);
	// mentionReponse(bot, message);
	// Features
	// getTiktok(bot, message).catch(logError);
	previewMessage(bot, message).catch(logError);
	previewReddit(bot, message).catch(logError);
	// Channel bridge & passthrough
	channelPassthrough(bot, message).catch(logError);
	channelBridging(bot, message).catch(logError);
}

export default { run };
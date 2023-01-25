import { commandHandler, adminCommandHandler } from './messageCreate/handlers.js';
import { catEmotes } from './messageCreate/misc.js';
import { previewMessage, previewReddit } from './messageCreate/features.js';
import { dmRelay, channelBridging, channelPassthrough } from './messageCreate/bridges.js';

async function run(bot, message) {
	if (message.author.bot) {return;}
	// Command handlers
	commandHandler(bot, message);
	adminCommandHandler(bot, message).catch(err => bot.logger.err(err));
	// Dm relay
	dmRelay(bot, message).catch(err => bot.logger.err(err));
	// Misc
	// Hardcoded to work for my personal guild with my cat emote guild
	catEmotes(bot, message).catch(err => bot.logger.err(err));
	// mentionReponse(bot, message);
	// Features
	// getTiktok(bot, message).catch(err => bot.logger.err(err));
	previewMessage(bot, message).catch(err => bot.logger.err(err));
	previewReddit(bot, message).catch(err => bot.logger.err(err));
	// Channel bridge & passthrough
	channelPassthrough(bot, message).catch(err => bot.logger.err(err));
	channelBridging(bot, message).catch(err => bot.logger.err(err));
}

export default { run };
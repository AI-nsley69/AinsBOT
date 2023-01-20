import { commandHandler, adminCommandHandler } from './messageCreate/handlers.js';
import { catEmotes } from './messageCreate/misc.js';
import { getTiktok, previewMessage, previewReddit } from './messageCreate/features.js';
import { dmRelay, channelBridging, channelPassthrough } from './messageCreate/bridges.js';


async function run(bot, message) {
	// Check if the author is a bot
	if (message.author.bot) {return;}
	// Command handlers
	commandHandler(bot, message);
	adminCommandHandler(bot, message);
	// Dm relay
	dmRelay(bot, message);
	// Misc
	// Hardcoded to work for my personal guild with my cat emote guild
	catEmotes(bot, message);
	// mentionReponse(bot, message);
	// Features
	getTiktok(bot, message);
	previewMessage(bot, message);
	previewReddit(bot, message);
	// Channel bridge & passthrough
	channelPassthrough(bot, message);
	channelBridging(bot, message);
}

export default { run };
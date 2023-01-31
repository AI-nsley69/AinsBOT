import dotenv from 'dotenv';
import { Bot } from './modules/bot.js';

async function main() {
	const promises = [];

	const bot = new Bot(promises);

	Promise.all(promises).then(() => {
		for (const [eventName, event] of bot.events) {
			bot.client.on(eventName, async (...args) => {
				try {
					await event.run(bot, ...args);
				}
				catch (err) {
					bot.logger.log(err);
				}
			});
		}
	});

	dotenv.config();
	bot.client.login(process.env.token);
}

main();
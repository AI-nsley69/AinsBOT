const file = './logs/latest.log';

module.exports = {
	err: async (bot, toLog) => {
		log(bot, toLog, 'ERR');
	},
	verbose: async (bot, toLog) => {
		if (bot.config.logLevel !== 'verbose') return;
		log(bot, toLog, 'VERBOSE');
	},
	warn: async (bot, toLog) => {
		if (bot.config.logLevel !== 'warn' || bot.config.logLevel !== 'verbose') return;
		log(bot, toLog, 'WARN');
	},
};

function log(bot, str, level) {
	const currentTime = new Date();
	str = `(${currentTime.toTimeString().split(' ')[0]}) [LOG/${level}] ${str}`;
	console.log(str);
	bot.fs.appendFile(file, `${str}\n`, (err) => {
		if (err) throw err;
	});
}

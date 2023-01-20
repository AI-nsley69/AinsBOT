const chalk = require('chalk');
const file = './logs/latest.log';

module.exports = {
	err: async (bot, toLog) => {
		log(bot, toLog, chalk.redBright('ERR'));
	},
	verbose: async (bot, toLog) => {
		if (bot.config.logLevel !== 'verbose') return;
		log(bot, toLog, chalk.greenBright('VERBOSE'));
	},
	warn: async (bot, toLog) => {
		if (bot.config.logLevel !== 'warn' || bot.config.logLevel !== 'verbose') return;
		log(bot, toLog, chalk.rgb(255, 139, 40)('WARN'));
	},
};

function log(bot, str, level) {
	const currentTime = new Date();
	str = `(${chalk.magentaBright(currentTime.toTimeString().split(' ')[0])}) [${chalk.yellow('LOG')}/${level}] ${str}`;
	console.log(str);
	bot.fs.appendFile(file, `${str}\n`, (err) => {
		if (err) throw err;
	});
}

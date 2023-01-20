import chalk from 'chalk';
import fs from 'fs';
const file = './logs/latest.log';

async function err(bot, toLog) {
	log(bot, toLog, chalk.redBright('ERR'));
}
async function verbose(bot, toLog) {
	if (bot.config.logLevel !== 'verbose') {return;}
	log(bot, toLog, chalk.greenBright('VERBOSE'));
}
async function warn(bot, toLog) {
	if (bot.config.logLevel !== 'warn' || bot.config.logLevel !== 'verbose') {return;}
	log(bot, toLog, chalk.rgb(255, 139, 40)('WARN'));
}

export default { err, verbose, warn };

function log(bot, str, level) {
	const currentTime = new Date();
	str = `(${chalk.magentaBright(currentTime.toTimeString().split(' ')[0])}) [${chalk.yellow('LOG')}/${level}] ${str}`;
	console.log(str);
	fs.appendFile(file, `${str}\n`, (err) => {
		if (err) throw err;
	});
}

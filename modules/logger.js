import chalk from 'chalk';
import fs from 'fs';
const file = './logs/latest.log';
let currentTime;

async function err(bot, toLog) {
	sendToConsole(toLog, chalk.redBright('ERR'));
	saveToFile(toLog, 'ERR');
}
async function verbose(bot, toLog) {
	if (bot.config.logLevel !== 'verbose') {return;}
	sendToConsole(toLog, chalk.greenBright('VERBOSE'));
	saveToFile(toLog, 'VERBOSE');
}
async function warn(bot, toLog) {
	if (bot.config.logLevel !== 'warn' || bot.config.logLevel !== 'verbose') {return;}
	sendToConsole(toLog, chalk.rgb(255, 139, 40)('WARN'));
	saveToFile(toLog, 'WARN');
}

export default { err, verbose, warn };

function sendToConsole(str, level) {
	currentTime = new Date();
	str = `(${chalk.magentaBright(currentTime.toTimeString().split(' ')[0])}) [${chalk.yellow('LOG')}/${level}] ${str}`;
	console.log(str);
}

function saveToFile(str, level) {
	str = `(${currentTime.toTimeString().split(' ')[0]}) [${'LOG'}/${level}] ${str}`;
	fs.appendFile(file, `${str}\n`, (err) => {
		if (err) throw err;
	});
}

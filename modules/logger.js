import chalk from 'chalk';
import fs from 'fs';

export class Logger {
	constructor(logLevel, logFile) {
		this.logLevel = logLevel;
		this.logFile = logFile;
		this.time = new Date();
	}

	updateTime() {
		this.time = new Date();
	}

	sendToConsole(str, level) {
		str = `(${chalk.magentaBright(this.time.toTimeString().split(' ')[0])}) [${chalk.yellow('LOG')}/${level}] ${str}`;
		console.log(str);
	}

	saveToFile(str, level) {
		str = `(${this.time.toTimeString().split(' ')[0]}) [${'LOG'}/${level}] ${str}`;
		fs.appendFile(this.logFile, `${str}\n`, (err) => {
			if (err) throw err;
		});
	}

	async err(err) {
		this.updateTime();
		this.sendToConsole(err, chalk.redBright('err'));
		this.saveToFile(err, 'ERR');
	}

	async warn(err) {
		if (this.logLevel !== 'warn' && this.logLevel !== 'verbose') return;
		this.updateTime();
		this.sendToConsole(err, chalk.rgb(255, 139, 40)('WARN'));
		this.saveToFile(err, 'WARN');

	}

	async verbose(err) {
		if (this.logLevel !== 'verbose') return;
		this.updateTime();
		this.sendToConsole(err, chalk.greenBright('VERBOSE'));
		this.saveToFile(err, 'VERBOSE');
	}
}

import chalk from 'chalk';
import fs from 'fs';

const LogLevel = {
	Verbose: 'VERBOSE',
	Warn: 'WARN',
	Err: 'ERR',
};

export class Logger {
	constructor(logLevel, logFile) {
		this.logLevel = logLevel;
		this.logFile = logFile.toUpperCase();
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
		this.sendToConsole(err, chalk.redBright(LogLevel.Err));
		this.saveToFile(err, LogLevel.Err);
	}

	async warn(err) {
		if (this.logLevel !== LogLevel.Warn && this.logLevel !== LogLevel.Verbose) return;
		this.updateTime();
		this.sendToConsole(err, chalk.rgb(255, 139, 40)(LogLevel.Warn));
		this.saveToFile(err, LogLevel.Warn);

	}

	async verbose(err) {
		if (this.logLevel !== LogLevel.Verbose) return;
		this.updateTime();
		this.sendToConsole(err, chalk.greenBright(LogLevel.Verbose));
		this.saveToFile(err, LogLevel.Verbose);
	}
}

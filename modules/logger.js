import chalk from 'chalk';
import fs from 'fs';

const LogLevel = {
	Verbose: 'VERBOSE',
	Warn: 'WARN',
	Err: 'ERR',
};

export class Logger {
	constructor(logLevel, logFile) {
		this.logLevel = logLevel.toUpperCase();
		this.logFile = logFile;
		this.date = new Date();
		this.time = '';
	}

	updateTime() {
		this.date = new Date();
		this.time = this.date.toTimeString().split(' ')[0];
	}

	sendToConsole(err, level) {
		err = `(${chalk.magentaBright(this.time)}) [${chalk.yellow('LOG')}/${level}] ${err}`;
		console.log(err);
	}

	saveToFile(err, level) {
		err = `(${this.time}) [LOG}/${level}] ${err}`;
		fs.appendFile(this.logFile, `${err}\n`, (err) => {
			if (err) throw err;
		});
	}

	log(err, consoleLogLevel, fileLogLevel) {
		this.updateTime();
		this.sendToConsole(err, consoleLogLevel);
		this.saveToFile(err, fileLogLevel);
	}

	async err(err) {
		this.log(
			err,
			chalk.redBright(LogLevel.Err),
			LogLevel.Err,
		);
	}

	async warn(err) {
		if (this.logLevel !== LogLevel.Warn && this.logLevel !== LogLevel.Verbose) return;
		this.log(
			err,
			chalk.rgb(255, 139, 40)(LogLevel.Warn),
			LogLevel.Warn,
		);
	}

	async verbose(err) {
		if (this.logLevel !== LogLevel.Verbose) return;
		this.log(
			err,
			chalk.greenBright(LogLevel.Verbose),
			LogLevel.Verbose,
		);
	}
}

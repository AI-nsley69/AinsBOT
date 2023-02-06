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
		this.dateString = this.date.toISOString().split('T')[0];
		this.timeString = this.date.toTimeString().split(' ')[0];
	}

	sendToConsole(err, level) {
		err = getString(
			chalk.cyanBright(this.dateString),
			chalk.magentaBright(this.timeString),
			chalk.yellowBright('LOG'),
			level,
			err,
		);
		console.log(err);
	}

	saveToFile(err, level) {
		err = getString(
			this.dateString,
			this.timeString,
			'LOG',
			level,
			err,
		);
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

function getString(date, time, brand, level, error) {
	return `(${date}) ${time} [${brand}/${level}]: ${error}`;
}
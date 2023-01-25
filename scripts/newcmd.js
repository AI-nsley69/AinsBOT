import { argv } from 'node:process';
import fs from 'fs';

const commandsPath = './commands';

function main() {
	const category = argv[3];
	if (!category) {
		console.log('Missing category argument!');
		process.exit(-1);
	}

	const command = argv[4];
	if (!command) {
		console.log('Missing command argument!');
		process.exit(-1);
	}

	const path = `${loadDir(category)}/${command}.js`;
	const stream = loadFile(path);
	writeCommand(stream);
	console.log(`Successfully added new command ${command} in ${category}`);
}


function loadDir(dir) {
	const path = `${commandsPath}/${dir}`;
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}

	return path;
}

function loadFile(file) {
	if (fs.existsSync(file)) {
		console.log('Command already exists!');
		process.exit(-1);
	}

	return fs.createWriteStream(file);
}

function writeCommand(stream) {
	const cmd = 'aW1wb3J0IHsgQ29tbWFuZCwgUmVxQXJnIH0gZnJvbSAnLi4vLi4vbW9kdWxlcy9jb21tYW5kQ2xhc3MuanMnOwoKZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoKQoJLnNldERlc2NyaXB0aW9uKCdOZXcgY29tbWFuZCEnKQoJLnNldEFyZ3MoewoJCWV4YW1wbGU6IFJlcUFyZy5TdHJpbmcsCgl9KQoJLnNldFJ1bihhc3luYyAoYm90LCBjdHgpID0+IHsKCQljdHgubWVzc2FnZSgnSGVsbG8gV29ybGQhJyk7Cgl9KTs=';
	const buf = Buffer.from(cmd, 'base64');

	stream.write(buf.toString('utf-8'));
	stream.end();
}

main();
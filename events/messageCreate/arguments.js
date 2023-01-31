// Send all the text after the command as an Array to "messageArgText" param
// CommandArgs param should be sent the args Object that is sent during command registrating
// This function returns an array of the argument value, ordered in the order of commandArgObject's keys
// Will return null if the arguement structure or input is invalid
import { OptArg, ReqArg } from '../../modules/commandClass.js';

function * args(object) {
	const objfields = Object.entries(object);
	let i = -1;
	i++;
	if (i >= objfields.length) return;
	yield objfields[i];
}

// eslint-disable-next-line no-unused-vars
async function argParser(bot, contents, commandArgObject) {
	if (Object.keys(commandArgObject).length < 1) return {};
	const fieldValues = [];
	let hasMetCoalesc = false;

	for (const newField of args(commandArgObject)) {
		if (!newField) throw new Error('Invalid Command Structure');
		const isRequired = newField[1].charAt(0) === 'r';

		if (hasMetCoalesc) {
			// if coalesc has been met and the next arg is non optional, argument order is deemed invalid
			if (isRequired) throw new Error('Non optional argument after coalesc argument');
			newField[1] = null;
		}
		else if (newField[1] === ReqArg.StringCoalescing || newField[1] === OptArg.StringCoalescing) {
			if (contents.join().length < 1 && isRequired) throw new Error(`Could not parse value for the ${newField[0]} arument`);
			newField[1] = contents.join(' ');
			hasMetCoalesc = true;
		}
		else {
			const parsedValue = await convertArg(contents[0], newField[1], bot);
			newField[1] = parsedValue;
			// if the parsed value is null and required, there command run is invalid
			if (!parsedValue) {
				if (isRequired) {
					throw new Error(`Could not parse value for the ${newField[0]} argument`);
				}
				// If the parsed value is null but the arg is optional, the content will not be removed
				// so that it can be tried to be parsed with the next arg
			}
			else {
				// if the parsed value is not null the the content is assigned to an argument and hence remmoved
				contents.shift();
			}
		}
		fieldValues.push(newField);
	}

	return Object.fromEntries(fieldValues);
}

async function convertArg(contentElement, type, bot) {
	let returnVal;
	switch (type) {
	case ReqArg.String: case OptArg.String: {
		returnVal = contentElement;
		break;
	}
	case ReqArg.Boolean: case OptArg.Boolean: {
		if (contentElement === 'true') {
			returnVal = true;
		}
		else if (contentElement === 'false') {
			returnVal = false;
		}
		else {
			returnVal = null;
		}
		break;
	}
	case ReqArg.Channel: case OptArg.Channel: {
		let channelIdTofetch = contentElement;
		if (!channelIdTofetch) return null;
		if (contentElement.startsWith('<#')) {
			const startIndex = 2;
			channelIdTofetch = contentElement.substring(startIndex, contentElement.length - 1);
		}
		const channelFromCache = bot.client.channels.cache.get(channelIdTofetch);
		if (!channelFromCache) {
			// eslint-disable-next-line no-unused-vars
			returnVal = await bot.client.channels.fetch(channelIdTofetch).catch(err => {
				bot.logger.warn('Could not fetch channel');
			});
		}
		else {
			returnVal = channelFromCache;
		}

		break;
	}
	case ReqArg.User: case OptArg.User: {
		let idTofetch = contentElement;
		if (!idTofetch) return null;
		if (contentElement.startsWith('<@')) {
			const startIndex = contentElement.charAt(2) === '!' ? 3 : 2;
			idTofetch = contentElement.substring(startIndex, contentElement.length - 1);
		}
		const userFromCache = bot.client.users.cache.get(idTofetch);
		if (!userFromCache) {
			// eslint-disable-next-line no-unused-vars
			returnVal = await bot.client.users.fetch(idTofetch).catch(err => {
				bot.logger.warn('Could not fetch the user');
			});
		}
		else {
			returnVal = userFromCache;
		}
		break;
	}
	default:
		returnVal = null;
	}
	return returnVal;
}

export { argParser };
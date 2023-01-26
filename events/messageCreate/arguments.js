// Send all the text after the command as an Array to "messageArgText" param
// CommandArgs param should be sent the args Object that is sent during command registrating
// This function returns an array of the argument value, ordered in the order of commandArgObject's keys
// Will return null if the arguement structure or input is invalid
import { OptArg, ReqArg } from '../../modules/commandClass.js';

// eslint-disable-next-line no-unused-vars
async function argParser(bot, contents, commandArgObject) {
	const fields = Object.entries(commandArgObject);
	if (fields.length < 1) return {};
	const fieldValues = fields.slice();
	let hasMetCoalesc = false;

	for (let i = 0; i < fields.length; i++) {
		const fieldElement = fields[i][1];
		if (!fieldElement) throw new Error('Invalid Command Structure');
		const isRequired = fieldElement.charAt(0) === 'r';

		if (hasMetCoalesc) {
			// if coalesc has been met and the next arg is non optional, argument order is deemed invalid
			if (isRequired) throw new Error('Non optional argument after coalesc argument');
			fieldValues[i][1] = null;
		}
		else if (fieldElement === ReqArg.StringCoalescing || fieldElement === OptArg.StringCoalescing) {
			if (contents.join().length < 1 && isRequired) throw new Error(`Could not parse value for the ${fieldElement} arument`);
			fieldValues[i][1] = contents.join();
			hasMetCoalesc = true;
		}
		else {
			const parsedValue = convertArg(contents[0], fieldElement, bot);
			fieldValues[i][1] = parsedValue;
			// if the parsed value is null and required, there command run is invalid
			if (!parsedValue) {
				if (isRequired) {
					throw new Error(`Could not parse value for the ${fieldElement} arument`);
				}
				// If the parsed value is null but the arg is optional, the content will not be removed
				// so that it can be tried to be parsed with the next arg
			}
			else {
				// if the parsed value is not null the the content is assigned to an argument and hence remmoved
				contents.pop();
			}
		}

	}

	return Object.fromEntries(fieldValues);
}

async function convertArg(contentElement, type, bot) {
	let returnVal;
	switch (type) {
	case ReqArg.String:
	case OptArg.String: {
		returnVal = contentElement;
		break;
	}
	case ReqArg.Boolean:
	case OptArg.Boolean: {
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
	case ReqArg.Channel:
	case OptArg.Channel: {
		let channelIdTofetch = contentElement;
		if (contentElement.startsWith('<@')) {
			channelIdTofetch = contentElement.substring(2, 20);
		}
		const userFromCache = bot.client.channels.cache.get(channelIdTofetch);
		if (!userFromCache) {
			// eslint-disable-next-line no-unused-vars
			returnVal = await bot.client.channels.fetch(channelIdTofetch).catch(err => {
				bot.logger.warn('Could not fetch channel');
			});
		}
		else {
			returnVal = userFromCache;
		}
		break;
	}
	case ReqArg.User:
	case OptArg.User: {
		let idTofetch = contentElement;
		if (contentElement.startsWith('<@!')) {
			idTofetch = contentElement.substring(3, 21);
		}
		else if (contentElement.startsWith('<@')) {
			idTofetch = contentElement.substring(2, 20);
		}
		const userFromCache = bot.client.users.cache.get(idTofetch);
		if (!userFromCache) {
			// eslint-disable-next-line no-unused-vars
			returnVal = await bot.client.fetchUser(idTofetch).catch(err => {
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
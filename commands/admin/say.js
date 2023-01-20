const description = 'Repeat all the arguments';
const usage = '[string to repeat]';
async function run(bot, message, args) {
	message.delete().catch();
	message.channel.send(args.join(' '));
}

export default { description, usage, run };
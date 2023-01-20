const description = 'Kill the bot';
const usage = '';
async function run(bot, message) {
	console.log(`Bot shutdown by ${message.author.tag}`);
	await message.channel.send('Shutting down..');
	process.exit();
}

export default { description, usage, run };
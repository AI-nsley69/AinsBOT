const description = 'Get dm channel id from bot';
const usage = '';
async function run(bot, message, args) {
	// Taking the L if it can't delete message
	message.delete().catch(L => L);
	// Fetch target, return if it doesn't exist
	const target = await bot.client.users.fetch(args.shift()) || message.mentions.members.first().user;
	if (!target) {return;}
	// Fetch the channel, return if it doesn't exist
	const channel = await target.createDM();
	if (!channel) {return;}
	// Dm the author if everything goes smoothly
	message.author.send(`Target: ${target.tag}\nDM: ${channel.id}`);
}

export default { description, usage, run };
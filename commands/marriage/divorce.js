import { MessageEmbed } from 'discord.js';


const description = 'Divorce your spouse';
const usage = '';
const permission = null;
const botPermissions = [];
const guild = true;
const cooldown = 30;
async function run(bot, message, loadingMsg) {
	const spouse = await getSpouse(bot, message.author.id);
	if (!spouse) {
		return bot.utils.softErr(
			bot,
			message,
			'You have no maiden 🙈',
			loadingMsg,
		);
	}

	divorce(bot, message.author.id, spouse.id);

	const embed = new MessageEmbed()
		.setDescription(`${message.author} has divorced ${spouse}!`)
		.setColor(bot.consts.Colors.INFO)
		.setTimestamp();

	loadingMsg.edit({ embeds: [embed] });
}

async function getSpouse(bot, id) {
	const status = await bot.db.marriages.findAll({
		where: {
			userId: id,
		},
	});

	if (!status[0]) return null;
	return await bot.client.users.fetch(status[0].dataValues.spouseId);
}

async function divorce(bot, id, spouse) {
	await bot.db.marriages.destroy({
		where: {
			userId: id,
		},
	});

	await bot.db.marriages.destroy({
		where: {
			userId: spouse,
		},
	});
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
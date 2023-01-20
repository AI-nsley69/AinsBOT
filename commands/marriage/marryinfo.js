import { MessageEmbed } from 'discord.js';


const description = 'Get info about a marriage';
const usage = '(user)';
const permission = null;
const botPermissions = [];
const guild = true;
const cooldown = 5;
async function run(bot, message, loadingMsg) {
	// Get the user
	const member = message.mentions.members.first() || message.member;
	const user = member.user;

	const status = await bot.db.marriages.findAll({
		where: {
			userId: user.id,
		},
	});

	if (!status[0]) {
		return bot.utils.softErr(
			bot,
			message,
			'User is not married!',
			loadingMsg,
		);
	}
	const spouse = await bot.client.users.fetch(status[0].dataValues.spouseId);

	const embed = new MessageEmbed()
		.setTitle(`${user.username}'s marriage! 💍`)
		.setColor(bot.consts.Colors.INFO)
		.setAuthor({
			name: user.tag,
			iconURL: user.displayAvatarURL(),
		})
		.setThumbnail(spouse.displayAvatarURL({ size: 256 }))
		.addFields([
			{
				name: 'Married to',
				value: spouse.tag,
			},
			{
				name: 'Since',
				value: new Date(status[0].dataValues.date).toDateString(),
			},
		]);

	loadingMsg.edit({ embeds: [embed] });
}

export default { description, usage, permission, botPermissions, guild, cooldown, run };
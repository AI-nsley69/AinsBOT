import { Command, ReqArg } from '../../modules/commandClass.js';


export default new Command()
	.setDescription('Propose to another user!')
	.setDescription('[user]')
	.setArgs({
		user: ReqArg.User,
	})
	.setGuild(true)
	.setCooldown(5)
	.setRun(async (bot, ctx) => {
		const { user } = ctx.getArgs();
		if (!(await isAbleToMarry(bot, ctx.getAuthor(), user))) {
			ctx.message(
				'Sorry, this proposal cannot be accepted!\nThis may because you or them are already married, you\'re trying to marry yourself or you\'re trying to marry a bot.',
			);
			return;
		}
		// Consent is important
		ctx.message(
			`${user} do you wish to marry ${ctx.getAuthor()}? 🥹 (y/n)`,
		);

		try {
			bot.helpers
				.get('message')
				.awaitResponse(ctx._src, user.id, 60 * 1000)
				.then((res) => {
					if (res.startsWith('y') && res.length < 4) {
						addMarriage(bot, ctx.getAuthor(), user);
						ctx.message(
							`I hereby pronounce ${ctx.getAuthor()} & ${user} a married couple! 🫶`,
						);
					}
					else if (res.startsWith('n') && res.length < 4) {
						ctx.message('Get rejected bozo L 😈');
					}
					else {
						ctx.message(
							'Unrecognized response, marriage cannot be established :c',
						);
					}
				});
		}
		catch (err) {
			ctx.message('You just got ghosted! 👻');
		}
	});

async function isAbleToMarry(bot, author, user) {
	if (user.bot) return false;
	if (user.id === author.id) return false;
	const isAuthorMarried = await bot.db.marriages.findAll({
		where: {
			userId: author.id,
		},
	});
	if (isAuthorMarried[0]) return false;
	const isTargetMarried = await bot.db.marriages.findAll({
		where: {
			userId: user.id,
		},
	});
	if (isTargetMarried[0]) return false;
	return true;
}

async function addMarriage(bot, author, user) {
	const time = Date.now();

	await bot.db.marriages.create({
		userId: author.id,
		spouseId: user.id,
		date: time,
	});

	await bot.db.marriages.create({
		userId: user.id,
		spouseId: author.id,
		date: time,
	});
}
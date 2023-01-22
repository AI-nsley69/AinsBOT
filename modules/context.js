class Context {
	constructor(author, channel, guild) {
		this._author = author;
		this._channel = channel;
		this._guild = guild;
	}

	setArgs(args) {
		this._args = args;
	}

	getArgs() {
		return this._args;
	}

	getAuthor() {
		return this._author;
	}

	getChannel() {
		return this._channel;
	}

	getGuild() {
		return this._guild;
	}
}

class SlashContext extends Context {
	constructor(author, channel, guild, interaction) {
		super(author, channel, guild);
		this.interaction = interaction;
	}

	message(msg) {
		this.interaction.reply(msg);
	}

	embed(embeds) {
		this.interaction.reply({ embeds: embeds });
	}
}

class TextContext extends Context {
	constructor(author, channel, guild, msg) {
		super(author, channel, guild);
		this.msg = msg;
	}

	message(str) {
		this.msg.channel.send(str);
	}

	embed(embeds) {
		this.msg.channel.send({ embeds: embeds });
	}
}

export { TextContext, SlashContext, Context };
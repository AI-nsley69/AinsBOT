import { MessageEmbed } from 'discord.js';
import { Colors } from './constants.js';

class Context {
	constructor(author, channel, guild, src) {
		this._author = author;
		this._channel = channel;
		this._guild = guild;
		this._src = src;
		this._cancelCd = false;
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

	cancelCooldown(bool = null) {
		if (!bool) return this._cancelCd;
		this._cancelCd = bool;
		return this._cancelCd;
	}

	err(err, cancelCd = true) {
		const embed = new MessageEmbed()
			.setTitle('Oh no! Something went wrong running this command!')
			.setDescription(err)
			.setColor(Colors.SOFT_ERR);

		this.cancelCooldown(cancelCd);
		this.embed([embed]);
	}
}

class SlashContext extends Context {
	constructor(interaction) {
		super(interaction.author, interaction.channel, interaction.guild, interaction);
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
	constructor(msg) {
		super(msg.author, msg.channel, msg.guild, msg);
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
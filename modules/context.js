import { MessageEmbed } from 'discord.js';
import pkg from './constants.js';
const { Colors } = pkg;

class Context {
	constructor(author, channel, guild, src) {
		this._author = author;
		this._channel = channel;
		this._guild = guild;
		this._src = src;
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

	err(ctx, err) {
		const embed = new MessageEmbed()
			.setTitle('Oh no! Something went wrong running this command!')
			.setDescription(err)
			.setColor(Colors.SOFT_ERR);

		ctx.embed([embed]);
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
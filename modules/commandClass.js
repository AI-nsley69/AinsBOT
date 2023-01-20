export class Command {
	constructor() {
		this.description = '';
		this.usage = '';
		this.permission = null;
		this.botPermissions = [];
		this.guild = false;
		this.cooldown = 0;
		this.run = null;
	}

	setDescription(desc) {
		this.description = desc;
		return this;
	}

	setUsage(usage) {
		this.usage = usage;
		return this;
	}

	setPermission(perms) {
		this.permission = perms;
		return this;
	}

	setBotPermission(botPerms) {
		this.botPermissions = botPerms;
		return this;
	}

	setGuild(bool) {
		this.guild = bool;
		return this;
	}

	setCooldown(cd) {
		this.cooldown = cd;
		return this;
	}

	setRun(run) {
		this.run = run;
		return this;
	}
}
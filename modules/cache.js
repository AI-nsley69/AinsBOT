import cache from 'memory-cache';

export class Cache {
	constructor(bot) {
		this.bot = bot;
		this.db = bot.db;
		this._cache = new cache.Cache();
	}

	getCache() {
		return this._cache;
	}

	updateAt(name, data, ttl = TTL.default) {
		if (this.getCache().get(name)) return;
		this.getCache().put(name, data, ttl);
	}

	async queryDb(table, key, query) {
		if (!this.db[table]) return null;
		const cacheKey = `${table}-${key}`;
		const data = this.getCache().get(cacheKey);

		if (!data) {
			const dbQuery = await this.db[table].findAll(query);

			if (!dbQuery[0]) {
				this.updateAt(cacheKey, null);
				return null;
			}

			this.updateAt(cacheKey, dbQuery[0].dataValues);
			return dbQuery[0].dataValues;
		}

		return data;
	}
}

const TTL = {
	default: 3 * 24 * 60 * 60,
};
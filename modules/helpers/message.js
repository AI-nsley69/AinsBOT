function awaitResponse(message, target, timeout) {
	let timedOut = false;

	const promise = new Promise((resolve, reject) => {
		const filter = (m) => m.author.id == target;
		const collec = message.channel.createMessageCollector({
			filter,
			time: timeout,
		});

		collec.on('collect', (m) => {
			resolve(m.content.toLowerCase());
		});

		collec.on('end', () => {
			timedOut = true;
			reject(new Error('Timed out!'));
		});
	});

	promise.timedOut = () => {
		return timedOut;
	};

	return promise;
}

export default { awaitResponse };

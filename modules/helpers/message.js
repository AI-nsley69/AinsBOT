const { MessageCollector } = require("discord.js");

module.exports = {
  awaitResponse: (message, target, timeout) => {
    let timedOut = false;

    promise = new Promise((resolve, reject) => {
      const filter = (m) => m.author.id == target;
      const collec = message.channel.createMessageCollector({
        filter,
        time: timeout,
      });

      collec.on("collect", (m) => {
        resolve(m.content.toLowerCase());
      });

      collec.on("end", (collected) => {
        timedOut = true;
        reject(new Error("Timed out!"));
      });
    });

    promise.timedOut = () => {
      return timedOut;
    };

    return promise;
  },
};
